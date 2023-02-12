import { Module } from '@nestjs/common';
import { PrismaService } from './service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DbModule {}
