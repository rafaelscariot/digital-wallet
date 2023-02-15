import { suite, test } from '@testdeck/jest';
import { DepositService, WithdrawalService } from '@wallet/service';
import { PrismaService } from '@db/service';
import { KafkaProducerService } from '@kafka/service';
import { TopicEnum } from '@shared/enum';

@suite('[Wallet Module] Withdrawal Service Unit Test')
class WithdrawalServiceUnitTest {
  private withdrawalService: WithdrawalService;
  private prismaServiceMock: PrismaService;
  private kafkaProducerMock: jest.SpyInstance;

  async before() {
    const kafkaProducerService = new KafkaProducerService();
    this.kafkaProducerMock = jest
      .spyOn(kafkaProducerService, 'produce')
      .mockResolvedValue();

    this.prismaServiceMock = {
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

    this.withdrawalService = new WithdrawalService(
      this.prismaServiceMock,
      kafkaProducerService,
    );
  }

  @test
  async 'Given a withdrawal amount greater than the amount held in the wallet, should return an error'() {
    const payload = JSON.stringify({
      walletId: 1,
      amount: 15,
    });

    await this.withdrawalService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.WITHDRAWAL,
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

    await this.withdrawalService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.WITHDRAWAL,
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

    await this.withdrawalService.perform(payload);

    expect(this.kafkaProducerMock).toHaveBeenCalledWith({
      topic: TopicEnum.ERROR,
      messages: [
        {
          value: {
            topic: TopicEnum.WITHDRAWAL,
            payload,
            error: Error(`Wallet ${JSON.parse(payload).walletId} not found`),
          }.toString(),
        },
      ],
    });
  }
}
