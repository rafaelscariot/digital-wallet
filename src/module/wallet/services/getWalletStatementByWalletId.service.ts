import { GetWalletStatementByWalletIdDTO } from '@dto/index';
import { WalletError } from '@error/index';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/index';

@Injectable()
export class GetWalletStatementByWalletIdService {
  constructor(private readonly prismaService: PrismaService) {}

  async perform(walletId: number): Promise<GetWalletStatementByWalletIdDTO> {
    const wallet = await this.prismaService.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw WalletError.NOT_FOUND(`wallet_${walletId}`);
    }

    const walletStatements = await this.prismaService.walletStatement.findMany({
      where: { walletId },
      orderBy: { createdAt: 'asc' },
    });

    return { amount: wallet.amount, movements: walletStatements };
  }
}
