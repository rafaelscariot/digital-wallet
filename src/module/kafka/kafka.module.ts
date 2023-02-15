import { PrismaService } from '@db/service';
import { Module } from '@nestjs/common';
import { CancelPurchaseService, PurchaseService } from '@purchase/service';
import { DepositService, WithdrawalService } from '@wallet/service';
import { KafkaTopicListener } from './listener';
import { KafkaConsumer } from './consumer';
import { KafkaProducer } from './producer';

@Module({
  providers: [
    KafkaConsumer,
    KafkaProducer,
    KafkaTopicListener,
    DepositService,
    PurchaseService,
    CancelPurchaseService,
    WithdrawalService,
    PrismaService,
  ],
  exports: [KafkaConsumer, KafkaProducer],
})
export class KafkaModule {}
