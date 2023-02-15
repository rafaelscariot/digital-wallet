import { PrismaService } from '@db/service';
import { KafkaConsumer } from '@kafka/consumer';
import { KafkaProducer } from '@kafka/producer';
import { Module } from '@nestjs/common';
import { CancelPurchaseService, PurchaseService } from './service';

@Module({
  providers: [
    CancelPurchaseService,
    PurchaseService,
    KafkaConsumer,
    KafkaProducer,
    PrismaService,
  ],
  exports: [CancelPurchaseService, PurchaseService],
})
export class PurchaseModule {}
