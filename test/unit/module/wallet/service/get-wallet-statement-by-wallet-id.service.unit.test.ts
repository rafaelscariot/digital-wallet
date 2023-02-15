import { suite, test } from '@testdeck/jest';
import { GetWalletStatementByWalletIdService } from '@wallet/service';
import { PrismaService } from '@db/service';
import { WalletError } from '@wallet/error';

@suite('[Wallet Module] Get Wallet Statement By Wallet Id Service Unit Test')
class GetWalletStatementByWalletIdServiceUnitTest {
  private getWalletStatementByWalletIdService: GetWalletStatementByWalletIdService;
  private prismaServiceMock: PrismaService;

  async before() {
    this.prismaServiceMock = {
      wallet: {
        findUnique: ({ where: { id } }) => {
          return { walletId: 1, amount: 10 };
        },
      },
      walletStatement: {
        findMany: ({ where: { walletId }, orderBy: { createdAt } }) => {
          return {
            amount: 10,
            movements: [
              {
                createdAt: new Date('Jul 12 2011'),
                walletId,
                deposit: 10,
                withdrawal: null,
                reversal: null,
              },
            ],
          };
        },
      },
    } as unknown as PrismaService;

    this.getWalletStatementByWalletIdService =
      new GetWalletStatementByWalletIdService(this.prismaServiceMock);
  }

  @test
  async 'Given a valid wallet id, should return the respective statements'() {
    const statements = await this.getWalletStatementByWalletIdService.perform(
      1,
    );

    expect(statements).toMatchSnapshot();
  }

  @test
  async 'Given an valid wallet id, should return an error'() {
    this.prismaServiceMock.wallet.findUnique = ({ where: { id } }) => {
      return null;
    };
    const statements = this.getWalletStatementByWalletIdService.perform(1);
    await expect(statements).rejects.toThrow(
      WalletError.NOT_FOUND(`wallet_${1}`),
    );
  }
}
