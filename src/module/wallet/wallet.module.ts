import { Module } from '@nestjs/common';
import { PrismaService } from '@db/service';
import { WalletController } from './controller';
import {
  GetWalletBalanceByWalletIdService,
  CreateWalletService,
  GetWalletStatementByWalletIdService,
  WithdrawalService,
  DepositService,
} from './service';
import { KafkaConsumerService, KafkaProducerService } from '@kafka/service';
import { CancelPurchaseService, PurchaseService } from '@purchase/service';

@Module({
  controllers: [WalletController],
  providers: [
    PrismaService,
    GetWalletBalanceByWalletIdService,
    CreateWalletService,
    GetWalletStatementByWalletIdService,
    KafkaConsumerService,
    KafkaProducerService,
    DepositService,
    WithdrawalService,
    PurchaseService,
    CancelPurchaseService,
  ],
})
export class WalletModule {}
