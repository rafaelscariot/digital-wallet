import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService, KafkaProducerService } from '@kafka/service';
import { TopicEnum } from '@shared/enum';
import { DepositService, WithdrawalService } from '@wallet/service';
import { isPayloadValid } from '@shared/util';
import { WalletError } from '@wallet/error';
import { PurchaseService, CancelPurchaseService } from '@purchase/service';

@Injectable()
export class KafkaTopicListener implements OnModuleInit {
  constructor(
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly depositService: DepositService,
    private readonly withdrawalService: WithdrawalService,
    private readonly purchaseService: PurchaseService,
    private readonly cancelPurchaseService: CancelPurchaseService,
  ) {}

  private readonly logger = new Logger(KafkaTopicListener.name);

  async onModuleInit() {
    await this.kafkaConsumerService.consume(
      {
        topics: [
          TopicEnum.DEPOSIT,
          TopicEnum.WITHDRAWAL,
          TopicEnum.PURCHASE,
          TopicEnum.CANCELLATION,
        ],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const payload = message.value.toString();

          if (isPayloadValid(payload)) {
            switch (topic.toString()) {
              case TopicEnum.DEPOSIT:
                await this.depositService.perform(payload);
                break;
              case TopicEnum.WITHDRAWAL:
                await this.withdrawalService.perform(payload);
                break;
              case TopicEnum.PURCHASE:
                await this.purchaseService.perform(payload);
                break;
              case TopicEnum.CANCELLATION:
                await this.cancelPurchaseService.perform(payload);
                break;
            }
          } else {
            this.logger.error(
              `Invalid payload from Kafka topic ${topic.toString()}`,
            );

            await this.kafkaProducerService.produce({
              topic: 'error',
              messages: [
                {
                  value: {
                    topic: topic.toString(),
                    error: WalletError.INVALID_PAYLOAD,
                    payload,
                  }.toString(),
                },
              ],
            });
          }
        },
      },
    );
  }
}
