import { GetWalletBalanceByWalletIdDTO } from '@dto/wallet.dto';
import { WalletError } from '@error/wallet.error';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';

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
