import { PrismaService } from '@db/service';
import { Module } from '@nestjs/common';
import { CancelPurchaseService, PurchaseService } from '@purchase/service';
import { DepositService, WithdrawalService } from '@wallet/service';
import { KafkaTopicListener } from './listener';
import { KafkaConsumerService, KafkaProducerService } from './service';

@Module({
  providers: [
    KafkaConsumerService,
    KafkaProducerService,
    KafkaTopicListener,
    DepositService,
    PurchaseService,
    CancelPurchaseService,
    WithdrawalService,
    PrismaService,
  ],
  exports: [KafkaConsumerService, KafkaProducerService],
})
export class KafkaModule {}
