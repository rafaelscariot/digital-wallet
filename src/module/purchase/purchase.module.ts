import { PrismaService } from '@db/service';
import { KafkaConsumerService, KafkaProducerService } from '@kafka/service';
import { Module } from '@nestjs/common';
import { CancelPurchaseService, PurchaseService } from './service';

@Module({
  providers: [
    CancelPurchaseService,
    PurchaseService,
    KafkaConsumerService,
    KafkaProducerService,
    PrismaService,
  ],
  exports: [CancelPurchaseService, PurchaseService],
})
export class PurchaseModule {}
