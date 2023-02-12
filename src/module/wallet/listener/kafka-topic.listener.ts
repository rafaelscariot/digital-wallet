import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService, KafkaProducerService } from '@kafka/service';
import { TopicEnum } from '@shared/enum';
import { MakeDepositService } from '@wallet/service/make-deposit.service';
import { isPayloadValid } from '@shared/util';
import { WalletError } from '@wallet/error';

@Injectable()
export class KafkaTopicListener implements OnModuleInit {
  constructor(
    private readonly kafkaConsumerService: KafkaConsumerService,
    private readonly makeDepositService: MakeDepositService,
    private readonly kafkaProducerService: KafkaProducerService,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumerService.consume(
      {
        topics: [
          TopicEnum.DEPOSIT,
          TopicEnum.WITHDRAWAL,
          TopicEnum.PURCHASE,
          TopicEnum.CANCELLATION,
          TopicEnum.REVERSAL,
        ],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          const payload = message.value.toString();

          if (isPayloadValid(payload)) {
            switch (topic.toString()) {
              case TopicEnum.DEPOSIT:
                await this.makeDepositService.perform(payload);
                break;
              case TopicEnum.WITHDRAWAL:
                console.log('saque');
                break;
              case TopicEnum.PURCHASE:
                console.log('compra');
                break;
              case TopicEnum.CANCELLATION:
                console.log('cancelamento');
                break;
              case TopicEnum.REVERSAL:
                console.log('estorno');
                break;
            }
          } else {
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
