import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateWalletDTO,
  GetWalletBalanceByWalletIdDTO,
  GetWalletStatementByWalletIdDTO,
} from '@wallet/dto';
import {
  GetWalletBalanceByWalletIdService,
  CreateWalletService,
  GetWalletStatementByWalletIdService,
} from '@wallet/service';

@ApiTags('wallet')
@Controller('wallet')
export class WalletController {
  constructor(
    private readonly getWalletBalanceByWalletIdService: GetWalletBalanceByWalletIdService,
    private readonly createWalletService: CreateWalletService,
    private readonly getWalletStatementByWalletIdService: GetWalletStatementByWalletIdService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a wallet' })
  @ApiResponse({
    status: 201,
    description: 'Wallet created',
    type: CreateWalletDTO,
  })
  async createWallet(@Body() data: CreateWalletDTO): Promise<CreateWalletDTO> {
    const { amount } = data;
    return this.createWalletService.perform({ amount });
  }

  @Get(':walletId/balance')
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

  @Get(':walletId/statement')
  @ApiOperation({ summary: 'Get wallet statement by wallet id' })
  @ApiResponse({
    status: 200,
    description: 'Wallet exists and the statement has been returned',
    type: GetWalletStatementByWalletIdDTO,
  })
  @ApiResponse({
    status: 404,
    description: "Wallet not found or wallet doesn't have statements",
  })
  async getWalletStatementByWalletId(
    @Param('walletId') walletId: number,
  ): Promise<GetWalletStatementByWalletIdDTO> {
    return this.getWalletStatementByWalletIdService.perform(Number(walletId));
  }
}
