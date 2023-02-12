import { Module } from '@nestjs/common';
import { KafkaConsumerService, KafkaProducerService } from './service';

@Module({
  providers: [KafkaConsumerService, KafkaProducerService],
  exports: [KafkaConsumerService, KafkaProducerService],
})
export class KafkaModule {}
