import { Module } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';
import { WalletController } from './wallet.controller';
import { GetWalletBalanceByWalletIdService } from './services/getWalletBalanceByWalletId.service';
import { CreateWalletService } from './services/createWallet.service';
import { GetWalletStatementByWalletIdService } from './services/getWalletStatementByWalletId.service';

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
