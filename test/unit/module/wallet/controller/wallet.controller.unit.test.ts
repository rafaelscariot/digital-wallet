import { suite, test } from '@testdeck/jest';
import { WalletController } from '@wallet/controller';
import {
  CreateWalletService,
  GetWalletBalanceByWalletIdService,
  GetWalletStatementByWalletIdService,
} from '@wallet/service';
import { Decimal } from '@prisma/client/runtime/library';

@suite('[Wallet Module] Wallet Controller Unit Test')
class WalletControllerUnitTest {
  private walletController: WalletController;
  private createWalletMock: jest.SpyInstance;
  private getWalletBalanceMock: jest.SpyInstance;
  private getWalletStatementMock: jest.SpyInstance;

  async before() {
    const createWalletService = new CreateWalletService(null);

    this.createWalletMock = jest
      .spyOn(createWalletService, 'perform')
      .mockResolvedValue(null);

    const getWalletBalanceService = new GetWalletBalanceByWalletIdService(null);

    this.getWalletBalanceMock = jest
      .spyOn(getWalletBalanceService, 'perform')
      .mockResolvedValue(null);

    const getWalletStatementService = new GetWalletStatementByWalletIdService(
      null,
    );

    this.getWalletStatementMock = jest
      .spyOn(getWalletStatementService, 'perform')
      .mockResolvedValue(null);

    this.walletController = new WalletController(
      getWalletBalanceService,
      createWalletService,
      getWalletStatementService,
    );
  }

  @test
  async 'Given an amount, should call the create wallet service'() {
    const body = { amount: new Decimal(20) };
    await this.walletController.createWallet(body);
    expect(this.createWalletMock).toHaveBeenCalledWith(body);
  }

  @test
  async 'Given a wallet id, should call the get balance service'() {
    await this.walletController.getWalletBalanceByWalletId(1);
    expect(this.getWalletBalanceMock).toHaveBeenCalledWith(1);
  }

  @test
  async 'Given a wallet id, should call the get wallet statement service'() {
    await this.walletController.getWalletStatementByWalletId(1);
    expect(this.getWalletStatementMock).toHaveBeenCalledWith(1);
  }
}
