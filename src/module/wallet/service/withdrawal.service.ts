import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/service';
import { KafkaProducer } from '@kafka/producer';
import { TopicEnum } from '@shared/enum';

@Injectable()
export class WithdrawalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaProducer: KafkaProducer,
  ) {}

  private readonly logger = new Logger(WithdrawalService.name);

  async perform(payload: string): Promise<void> {
    try {
      const { walletId, amount } = await this.parsePayload(payload);

      this.logger.log(`Withdrawing ${amount} from the wallet ${walletId}`);

      const wallet = await this.prismaService.wallet.findUnique({
        where: { id: walletId },
      });

      if (!wallet) {
        throw Error(`Wallet ${walletId} not found`);
      }

      if (amount > Number(wallet.amount)) {
        throw Error('Invalid amount');
      }

      const updateWallet = this.prismaService.wallet.update({
        data: { amount: Number(wallet.amount) - amount },
        where: { id: walletId },
      });

      const createWalletStatement = this.prismaService.walletStatement.create({
        data: { walletId, withdrawal: amount },
      });

      await this.prismaService.$transaction([
        updateWallet,
        createWalletStatement,
      ]);
    } catch (error) {
      this.logger.error(error);

      await this.kafkaProducer.produce({
        topic: 'error',
        messages: [
          {
            value: {
              topic: TopicEnum.DEPOSIT,
              payload,
              error: error,
            }.toString(),
          },
        ],
      });
    }
  }

  private async parsePayload(payload: string): Promise<{
    walletId: number;
    amount: number;
  }> {
    const { walletId, amount } = JSON.parse(payload);

    if (!walletId || !amount) throw Error('Payload missing attributes');

    return { walletId: Number(walletId), amount: Number(amount) };
  }
}
