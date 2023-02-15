import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { KafkaConsumer } from '@kafka/consumer';
import { TopicEnum } from '@shared/enum';
import { DepositService, WithdrawalService } from '@wallet/service';
import { isPayloadValid } from '@shared/util';
import { WalletError } from '@wallet/error';
import { PurchaseService, CancelPurchaseService } from '@purchase/service';
import { KafkaProducer } from '@kafka/producer';

@Injectable()
export class KafkaTopicListener implements OnModuleInit {
  constructor(
    private readonly kafkaConsumer: KafkaConsumer,
    private readonly kafkaProducer: KafkaProducer,
    private readonly depositService: DepositService,
    private readonly withdrawalService: WithdrawalService,
    private readonly purchaseService: PurchaseService,
    private readonly cancelPurchaseService: CancelPurchaseService,
  ) {}

  private readonly logger = new Logger(KafkaTopicListener.name);

  async onModuleInit() {
    await this.kafkaConsumer.consume(
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
            await this.executeTopicService(payload, topic.toString());
          } else {
            this.logger.error(
              `Invalid payload from Kafka topic ${topic.toString()}`,
            );

            await this.kafkaProducer.produce({
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

  private async executeTopicService(
    payload: string,
    topic: string,
  ): Promise<void> {
    const topicServices = {
      [TopicEnum.DEPOSIT]: this.depositService,
      [TopicEnum.WITHDRAWAL]: this.withdrawalService,
      [TopicEnum.PURCHASE]: this.purchaseService,
      [TopicEnum.CANCELLATION]: this.cancelPurchaseService,
    };

    await topicServices[topic].perform(payload);
  }
}
