import { WalletError } from '@wallet/error';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/service';
import { KafkaProducerService } from '@kafka/service';
import { TopicEnum } from '@shared/enum';

@Injectable()
export class MakeDepositService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  private readonly logger = new Logger(MakeDepositService.name);

  async perform(payload: string): Promise<void> {
    const { walletId, amount } = await this.parsePayload(payload);

    this.logger.log(`Depositing amount ${amount} in the wallet ${walletId}`);

    const wallet = await this.prismaService.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      await this.kafkaProducerService.produce({
        topic: 'error',
        messages: [
          {
            value: {
              topic: TopicEnum.DEPOSIT,
              error: WalletError.NOT_FOUND(`wallet_${walletId}`),
              payload,
            }.toString(),
          },
        ],
      });
    }

    const newAmount = Number(wallet.amount) + amount;

    await this.prismaService.wallet.update({
      data: { amount: newAmount },
      where: { id: walletId },
    });

    await this.prismaService.walletStatement.create({
      data: { walletId, deposit: amount },
    });

    await this.prismaService.$transaction([
      
    ])
  }

  private async parsePayload(payload: string): Promise<{
    walletId: number;
    amount: number;
  }> {
    const { walletId, amount } = JSON.parse(payload);
    return { walletId: Number(walletId), amount: Number(amount) };
  }
}
