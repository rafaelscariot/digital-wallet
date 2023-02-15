import { KafkaTopicListener } from '@kafka/listener';
import { suite, test } from '@testdeck/jest';
import { KafkaConsumerService } from '@kafka/service';

@suite('[Kafka Module] Kafka Topic Listener Unit Test')
class KafkaTopicListenerUnitTest {
  private consume: jest.SpyInstance;
  private listener: KafkaTopicListener;

  async before() {
    const kafkaConsumerService = new KafkaConsumerService();

    this.consume = jest
      .spyOn(kafkaConsumerService, 'consume')
      .mockResolvedValue(null);

    this.listener = new KafkaTopicListener(
      kafkaConsumerService,
      null,
      null,
      null,
      null,
      null,
    );
  }

  @test
  async 'Given a message, should call the consume method'() {
    await this.listener.onModuleInit();
    expect(this.consume).toHaveBeenCalled();
  }
}
