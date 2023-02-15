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
import { KafkaConsumer } from '@kafka/consumer';
import { KafkaProducer } from '@kafka/producer';
import { CancelPurchaseService, PurchaseService } from '@purchase/service';

@Module({
  controllers: [WalletController],
  providers: [
    PrismaService,
    GetWalletBalanceByWalletIdService,
    CreateWalletService,
    GetWalletStatementByWalletIdService,
    KafkaConsumer,
    KafkaProducer,
    DepositService,
    WithdrawalService,
    PurchaseService,
    CancelPurchaseService,
  ],
})
export class WalletModule {}
