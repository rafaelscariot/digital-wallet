import { suite, test } from '@testdeck/jest';
import { DepositService } from '@wallet/service';
import { PrismaService } from '@db/service';
import { KafkaProducerService } from '@kafka/service';
import { TopicEnum } from '@shared/enum';

@suite('[Wallet Module] Deposit Service Unit Test')
class DepositServiceUnitTest {
  private depositService: DepositService;
  private prismaServiceMock: PrismaService;
  private kafkaProducerMock: jest.SpyInstance;

  async before() {
    const kafkaProducerService = new KafkaProducerService();
    this.kafkaProducerMock = jest
      .spyOn(kafkaProducerService, 'produce')
      .mockResolvedValue();

    this.prismaServiceMock = {
      walletStatement: {
        create: ({ data: { walletId, deposit } }) => {
          return {
            walletId,
            deposit,
            amount: 10,
            createdAt: new Date('Jul 12 2011'),
            withdrawal: null,
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

    this.depositService = new DepositService(
      this.prismaServiceMock,
      kafkaProducerService,
    );
  }

  @test
  async 'Given an invalid payload, should produce an error'() {
    const payload = JSON.stringify({ atr: 1 });

    await this.depositService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.DEPOSIT,
            payload,
            error: Error(`Payload missing attributes`),
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

    await this.depositService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.DEPOSIT,
            payload,
            error: Error(`Wallet ${JSON.parse(payload).walletId} not found`),
          }.toString(),
        },
      ],
    });
  }
}
