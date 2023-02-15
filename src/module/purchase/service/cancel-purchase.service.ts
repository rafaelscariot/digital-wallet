import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/service';
import { KafkaProducerService } from '@kafka/service';
import { TopicEnum } from '@shared/enum';

@Injectable()
export class CancelPurchaseService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  private readonly logger = new Logger(CancelPurchaseService.name);

  async perform(payload: string): Promise<void> {
    try {
      const { purchaseId } = await this.parsePayload(payload);

      this.logger.log(`Cancelling the purchase ${purchaseId}`);

      const purchase = await this.prismaService.purchase.findUnique({
        where: { id: purchaseId },
      });

      if (!purchase) {
        throw Error(`Purchase ${purchaseId} not found`);
      }

      if (purchase.canceled) {
        throw Error(`Purchase ${purchaseId} already canceled`);
      }

      const purchaseWallet = await this.prismaService.wallet.findUnique({
        where: { id: purchase.walletId },
      });

      const updatePurchase = this.prismaService.purchase.update({
        where: { id: purchase.id },
        data: { canceled: true },
      });

      const updateWallet = this.prismaService.wallet.update({
        data: {
          amount: Number(purchaseWallet.amount) + Number(purchase.amount),
        },
        where: { id: purchaseWallet.id },
      });

      const createWalletStatement = this.prismaService.walletStatement.create({
        data: {
          walletId: purchaseWallet.id,
          reversal: purchase.amount,
        },
      });

      await this.prismaService.$transaction([
        updatePurchase,
        updateWallet,
        createWalletStatement,
      ]);
    } catch (error) {
      this.logger.error(error);

      await this.kafkaProducerService.produce({
        topic: 'error',
        messages: [
          {
            value: {
              topic: TopicEnum.CANCELLATION,
              payload,
              error: error,
            }.toString(),
          },
        ],
      });
    }
  }

  private async parsePayload(payload: string): Promise<{
    purchaseId: number;
  }> {
    const { purchaseId } = JSON.parse(payload);

    if (!purchaseId) throw Error('Payload missing attributes');

    return { purchaseId: Number(purchaseId) };
  }
}
