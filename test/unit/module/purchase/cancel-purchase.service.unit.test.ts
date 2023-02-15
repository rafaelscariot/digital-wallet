import { suite, test } from '@testdeck/jest';
import { KafkaProducer } from '@kafka/producer';
import { TopicEnum } from '@shared/enum';
import { CancelPurchaseService } from '@purchase/service';

@suite('[Wallet Module] Cancel Purchase Service Unit Test')
class CancelPurchaseServiceUnitTest {
  private cancelPurchaseService: CancelPurchaseService;
  private kafkaProducerMock: jest.SpyInstance;
  private prismaServiceMock;

  async before() {
    const kafkaProducer = new KafkaProducer();
    this.kafkaProducerMock = jest
      .spyOn(kafkaProducer, 'produce')
      .mockResolvedValue();

    this.prismaServiceMock = {
      purchase: {
        create: ({ data: { walletId, amount } }) => {
          return {};
        },
        findUnique: ({ where: { id } }) => {
          return {
            walletId: 1,
            purchaseId: id,
            amount: 10,
            canceled: false,
            createdAt: new Date('Jul 12 2011'),
          };
        },
        update: ({ where: { id }, data: { canceled } }) => {},
      },
      walletStatement: {
        create: ({ data: { walletId, withdrawal } }) => {
          return {};
        },
      },
      wallet: {
        findUnique: ({ where: { id } }) => {
          return { walletId: 1, amount: 10 };
        },
        update: ({ data: { amount }, where: { id } }) => {},
      },
      $transaction: (operations: []) => {},
    };

    this.cancelPurchaseService = new CancelPurchaseService(
      this.prismaServiceMock,
      kafkaProducer,
    );
  }

  @test
  async 'Given a purchase already canceled, should produce an error'() {
    const payload = JSON.stringify({
      purchaseId: 1,
    });

    this.prismaServiceMock.purchase.findUnique = ({ where: { id } }) => {
      return { canceled: true };
    };

    await this.cancelPurchaseService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.CANCELLATION,
            payload,
            error: Error(
              `Purchase ${JSON.parse(payload).purchaseId} already canceled`,
            ),
          }.toString(),
        },
      ],
    });
  }

  @test
  async 'Given an invalid payload, should produce an error'() {
    const payload = JSON.stringify({ atr: 1 });

    await this.cancelPurchaseService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.CANCELLATION,
            payload,
            error: Error('Payload missing attributes'),
          }.toString(),
        },
      ],
    });
  }

  @test
  async 'Given an invalid purchase id, should produce an error'() {
    const payload = JSON.stringify({
      purchaseId: 1,
    });

    this.prismaServiceMock.purchase.findUnique = ({ where: { id } }) => {
      return null;
    };

    await this.cancelPurchaseService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.CANCELLATION,
            payload,
            error: Error(`Wallet ${JSON.parse(payload).walletId} not found`),
          }.toString(),
        },
      ],
    });
  }
}
