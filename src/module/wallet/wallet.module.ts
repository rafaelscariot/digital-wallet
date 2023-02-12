import { Module } from '@nestjs/common';
import { PrismaService } from '@db/service';
import { WalletController } from './controller';
import {
  GetWalletBalanceByWalletIdService,
  CreateWalletService,
  GetWalletStatementByWalletIdService,
} from './service';
import { KafkaTopicListener } from './listener';
import { KafkaConsumerService, KafkaProducerService } from '@kafka/service';
import { MakeDepositService } from './service/make-deposit.service';

@Module({
  controllers: [WalletController],
  providers: [
    PrismaService,
    GetWalletBalanceByWalletIdService,
    CreateWalletService,
    GetWalletStatementByWalletIdService,
    KafkaTopicListener,
    KafkaConsumerService,
    KafkaProducerService,
    MakeDepositService,
  ],
})
export class WalletModule {}
