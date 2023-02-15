import { Logger, OnModuleInit } from '@nestjs/common';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

@Injectable()
export class KafkaProducer implements OnApplicationShutdown, OnModuleInit {
  private readonly kafka = new Kafka({
    brokers: [process.env.KAFKA_URL],
  });

  private readonly logger = new Logger(KafkaProducer.name);

  private readonly producer: Producer = this.kafka.producer();

  async onModuleInit() {
    await this.producer.connect();
  }

  async produce(record: ProducerRecord) {
    this.logger.log(`Producing record in topic ${record.topic}`);

    await this.producer.send(record);
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
