import { suite, test } from '@testdeck/jest';
import { CreateWalletService } from '@wallet/service';
import { PrismaService } from '@db/service';

@suite('[Wallet Module] Create Wallet Unit Test')
class CreateWalletUnitTest {
  private createWalletService: CreateWalletService;

  async before() {
    const prismaServiceMock: PrismaService = {
      wallet: {
        create: ({ data: { amount } }) => {
          return {
            amount,
            walletId: 1,
            createdAt: new Date('Jul 12 2011'),
          };
        },
      },
    } as unknown as PrismaService;

    this.createWalletService = new CreateWalletService(prismaServiceMock);
  }

  @test
  async 'Given a message, should call the consume method'() {
    const wallet = await this.createWalletService.perform({ amount: 10 });

    expect(wallet).toMatchSnapshot();
  }
}
