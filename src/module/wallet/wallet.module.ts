import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/index';
import { WalletController } from './index';
import {
  GetWalletBalanceByWalletIdService,
  CreateWalletService,
  GetWalletStatementByWalletIdService,
} from './services';

@Module({
  imports: [],
  controllers: [WalletController],
  providers: [
    PrismaService,
    GetWalletBalanceByWalletIdService,
    CreateWalletService,
    GetWalletStatementByWalletIdService,
  ],
})
export class WalletModule {}
