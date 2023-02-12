import { DbModule } from '@db/db.module';
import { Module } from '@nestjs/common';
import { WalletModule } from '@wallet/wallet.module';

@Module({
  imports: [WalletModule, DbModule],
})
export class AppModule {}
