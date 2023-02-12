import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/index';
import { WalletController } from './controller';
import {
  GetWalletBalanceByWalletIdService,
  CreateWalletService,
  GetWalletStatementByWalletIdService,
} from './service';

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
