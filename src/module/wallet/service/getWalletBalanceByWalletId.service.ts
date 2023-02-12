import { GetWalletBalanceByWalletIdDTO } from '@dto/index';
import { WalletError } from '@error/index';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@shared/index';

@Injectable()
export class GetWalletBalanceByWalletIdService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(GetWalletBalanceByWalletIdService.name);

  async perform(walletId: number): Promise<GetWalletBalanceByWalletIdDTO> {
    this.logger.log(`Getting wallet balance for the wallet ${walletId}`);

    const { amount } = await this.prismaService.wallet.findUnique({
      where: { id: walletId },
    });

    if (!amount) {
      throw WalletError.NOT_FOUND(`wallet_${walletId}`);
    }

    return { amount };
  }
}
