import { GetWalletBalanceByWalletIdDTO } from '@dto/index';
import { WalletError } from '@error/index';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/index';

@Injectable()
export class GetWalletBalanceByWalletIdService {
  constructor(private readonly prismaService: PrismaService) {}

  async perform(walletId: number): Promise<GetWalletBalanceByWalletIdDTO> {
    const walletBalance = await this.prismaService.wallet.findUnique({
      where: { id: walletId },
    });

    if (!walletBalance) {
      throw WalletError.NOT_FOUND(`wallet_${walletId}`);
    }

    return walletBalance;
  }
}
