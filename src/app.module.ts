import { Module } from '@nestjs/common';
import { DbModule } from '@db/db.module';
import { KafkaModule } from '@kafka/kafka.module';
import { WalletModule } from '@wallet/wallet.module';
import { PurchaseModule } from '@purchase/purchase.module';

@Module({
  imports: [WalletModule, DbModule, KafkaModule, PurchaseModule],
})
export class AppModule {}
