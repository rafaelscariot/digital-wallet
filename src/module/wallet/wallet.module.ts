import { Module } from '@nestjs/common';
import { PrismaService } from '@db/service';
import { WalletController } from './controller';
import {
  GetWalletBalanceByWalletIdService,
  CreateWalletService,
  GetWalletStatementByWalletIdService,
} from './service';

@Module({
  controllers: [WalletController],
  providers: [
    PrismaService,
    GetWalletBalanceByWalletIdService,
    CreateWalletService,
    GetWalletStatementByWalletIdService,
  ],
})
export class WalletModule {}
