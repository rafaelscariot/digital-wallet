import { Module } from '@nestjs/common';
import { WalletModule } from 'src/module/wallet/wallet.module';

@Module({
  imports: [WalletModule],
})
export class AppModule {}
