import { suite, test } from '@testdeck/jest';
import { GetWalletBalanceByWalletIdService } from '@wallet/service';
import { PrismaService } from '@db/service';
import { WalletError } from '@wallet/error';

@suite('[Wallet Module] Get Wallet Balance By Wallet Id Service Unit Test')
class GetWalletBalanceByWalletIdServiceUnitTest {
  private getWalletBalanceByWalletIdService: GetWalletBalanceByWalletIdService;
  private prismaServiceMock: PrismaService;

  async before() {
    this.prismaServiceMock = {
      wallet: {
        findUnique: ({ where: { id } }) => {
          return { walletId: 1, amount: 10 };
        },
      },
    } as unknown as PrismaService;

    this.getWalletBalanceByWalletIdService =
      new GetWalletBalanceByWalletIdService(this.prismaServiceMock);
  }

  @test
  async 'Given a valid wallet id, should return the respective amount'() {
    const amount = await this.getWalletBalanceByWalletIdService.perform(1);
    expect(amount).toStrictEqual({ amount: 10 });
  }

  @test
  async 'Given an invalid wallet id, should return an error'() {
    this.prismaServiceMock.wallet.findUnique = ({ where: { id } }) => {
      return null;
    };
    const amount = this.getWalletBalanceByWalletIdService.perform(1);
    await expect(amount).rejects.toThrow(WalletError.NOT_FOUND(`wallet_${1}`));
  }
}
