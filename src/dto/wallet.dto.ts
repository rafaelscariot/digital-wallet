import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';
import { IsDate, IsDecimal, IsNumber } from 'class-validator';

export class GetWalletBalanceByWalletIdDTO {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsDecimal()
  @ApiProperty({ type: Number })
  amount: Decimal;
}

export class CreateWalletDTO {
  @IsDecimal()
  @ApiProperty({ type: Number })
  amount: Decimal;
}

export class GetWalletStatementByWalletIdDTO {
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsDecimal()
  @ApiProperty({ type: Number })
  withdrawal?: Decimal;

  @IsDecimal()
  @ApiProperty({ type: Number })
  deposit?: Decimal;

  @IsDate()
  @ApiProperty()
  createdAt: Date;
}
