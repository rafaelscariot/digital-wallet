import { GetWalletStatementByWalletIdDTO } from '@dto/wallet.dto';
import { WalletError } from '@error/wallet.error';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class GetWalletStatementByWalletIdService {
  constructor(private readonly prismaService: PrismaService) {}

  async perform(walletId: number): Promise<GetWalletStatementByWalletIdDTO[]> {
    const wallet = await this.prismaService.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw WalletError.NOT_FOUND(`wallet_${walletId}`);
    }

    return this.prismaService.walletStatement.findMany({
      where: { walletId },
      orderBy: { createdAt: 'asc' },
    });
  }
}
