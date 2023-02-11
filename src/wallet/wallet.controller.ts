import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateWalletDTO,
  GetWalletBalanceByWalletIdDTO,
} from '@dto/wallet.dto';
import { GetWalletBalanceByWalletIdService } from './services/getWalletBalanceByWalletId.service';
import { CreateWalletService } from './services/createWallet.service';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly getWalletBalanceByWalletIdService: GetWalletBalanceByWalletIdService,
    private readonly createWalletService: CreateWalletService,
  ) {}

  @Get(':walletId')
  @ApiOperation({ summary: 'Get wallet balance by wallet id' })
  @ApiResponse({
    status: 200,
    description: 'Wallet exists and the balance has been returned',
    type: GetWalletBalanceByWalletIdDTO,
  })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  async getWalletBalanceByWalletId(
    @Param('walletId') walletId: number,
  ): Promise<GetWalletBalanceByWalletIdDTO> {
    return this.getWalletBalanceByWalletIdService.perform(Number(walletId));
  }

  @Post()
  @ApiOperation({ summary: 'Create a wallet' })
  @ApiResponse({
    status: 200,
    description: 'Wallet created',
    type: CreateWalletDTO,
  })
  async createWallet(@Body() data: CreateWalletDTO): Promise<CreateWalletDTO> {
    const { amount } = data;
    return this.createWalletService.perform({ amount });
  }
}
