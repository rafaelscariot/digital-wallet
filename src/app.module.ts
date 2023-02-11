import { Module } from '@nestjs/common';
import { WalletModule } from '@wallet/index';

@Module({
  imports: [WalletModule],
})
export class AppModule {}
