import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime';
import { IsArray, IsDate, IsDecimal } from 'class-validator';

export class GetWalletBalanceByWalletIdDTO {
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
  @IsDecimal()
  @ApiProperty({ type: Number })
  amount: Decimal;

  @IsArray()
  @ApiProperty()
  movements: WalletStatementMovementsDTO[];
}

class WalletStatementMovementsDTO {
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
