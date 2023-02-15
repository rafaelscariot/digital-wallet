import { GetWalletBalanceByWalletIdDTO } from '@wallet/dto';
import { WalletError } from '@wallet/error';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/service';

@Injectable()
export class GetWalletBalanceByWalletIdService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(GetWalletBalanceByWalletIdService.name);

  async perform(walletId: number): Promise<GetWalletBalanceByWalletIdDTO> {
    this.logger.log(`Getting wallet balance for the wallet ${walletId}`);

    const wallet = await this.prismaService.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw WalletError.NOT_FOUND(`wallet_${walletId}`);
    }

    return { amount: wallet.amount };
  }
}
