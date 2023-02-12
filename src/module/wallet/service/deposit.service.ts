import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/service';
import { KafkaProducerService } from '@kafka/service';
import { TopicEnum } from '@shared/enum';

@Injectable()
export class DepositService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  private readonly logger = new Logger(DepositService.name);

  async perform(payload: string): Promise<void> {
    try {
      const { walletId, amount } = await this.parsePayload(payload);

      this.logger.log(`Depositing amount ${amount} in the wallet ${walletId}`);

      const wallet = await this.prismaService.wallet.findUnique({
        where: { id: walletId },
      });

      if (!wallet) {
        throw Error(`Wallet ${walletId} not found`);
      }

      const update = this.prismaService.wallet.update({
        data: { amount: Number(wallet.amount) + amount },
        where: { id: walletId },
      });

      const create = this.prismaService.walletStatement.create({
        data: { walletId, deposit: amount },
      });

      await this.prismaService.$transaction([update, create]);
    } catch (error) {
      this.logger.error(error);

      await this.kafkaProducerService.produce({
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
