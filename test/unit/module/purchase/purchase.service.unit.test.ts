import { suite, test } from '@testdeck/jest';
import { PrismaService } from '@db/service';
import { KafkaProducer } from '@kafka/producer';
import { TopicEnum } from '@shared/enum';
import { PurchaseService } from '@purchase/service';

@suite('[Wallet Module] Purchase Service Unit Test')
class PurchaseServiceUnitTest {
  private purchaseService: PurchaseService;
  private prismaServiceMock: PrismaService;
  private kafkaProducerMock: jest.SpyInstance;

  async before() {
    const kafkaProducer = new KafkaProducer();
    this.kafkaProducerMock = jest
      .spyOn(kafkaProducer, 'produce')
      .mockResolvedValue();

    this.prismaServiceMock = {
      purchase: {
        create: ({ data: { walletId, amount } }) => {
          return {
            walletId,
            purchaseId: 1,
            amount,
            canceled: false,
            createdAt: new Date('Jul 12 2011'),
          };
        },
      },
      walletStatement: {
        create: ({ data: { walletId, withdrawal } }) => {
          return {
            walletId,
            deposit: null,
            amount: 10,
            createdAt: new Date('Jul 12 2011'),
            withdrawal,
            reversal: null,
          };
        },
      },
      wallet: {
        findUnique: ({ where: { id } }) => {
          return { walletId: 1, amount: 10 };
        },
        update: ({ data: { amount }, where: { id } }) => {},
      },
      $transaction: (operations: []) => {},
    } as unknown as PrismaService;

    this.purchaseService = new PurchaseService(
      this.prismaServiceMock,
      kafkaProducer,
    );
  }

  @test
  async 'Given a purchase with an amount greater than the available balance, should return an error'() {
    const payload = JSON.stringify({
      walletId: 1,
      amount: 15,
    });

    await this.purchaseService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.PURCHASE,
            payload,
            error: Error('Invalid amount'),
          }.toString(),
        },
      ],
    });
  }

  @test
  async 'Given an invalid payload, should produce an error'() {
    const payload = JSON.stringify({ atr: 1 });

    await this.purchaseService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.PURCHASE,
            payload,
            error: Error('Payload missing attributes'),
          }.toString(),
        },
      ],
    });
  }

  @test
  async 'Given an invalid walletId, should produce an error'() {
    const payload = JSON.stringify({
      walletId: 1,
      amount: 10,
    });

    this.prismaServiceMock.wallet.findUnique = ({ where: { id } }) => {
      return null;
    };

    await this.purchaseService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.PURCHASE,
            payload,
            error: Error(`Wallet ${JSON.parse(payload).walletId} not found`),
          }.toString(),
        },
      ],
    });
  }
}
