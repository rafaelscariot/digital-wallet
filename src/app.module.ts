import { Module } from '@nestjs/common';
import { DbModule } from '@db/db.module';
import { KafkaModule } from '@kafka/kafka.module';
import { WalletModule } from '@wallet/wallet.module';

@Module({
  imports: [WalletModule, DbModule, KafkaModule],
})
export class AppModule {}
