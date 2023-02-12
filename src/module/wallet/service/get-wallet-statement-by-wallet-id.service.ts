import { GetWalletStatementByWalletIdDTO } from '@wallet/dto';
import { WalletError } from '@wallet/error';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/service';

@Injectable()
export class GetWalletStatementByWalletIdService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(
    GetWalletStatementByWalletIdService.name,
  );

  async perform(walletId: number): Promise<GetWalletStatementByWalletIdDTO> {
    this.logger.log(`Getting wallet statements for the wallet ${walletId}`);

    const { amount } = await this.prismaService.wallet.findUnique({
      where: { id: walletId },
    });

    if (!amount) {
      throw WalletError.NOT_FOUND(`wallet_${walletId}`);
    }

    const walletStatements = await this.prismaService.walletStatement.findMany({
      where: { walletId },
      orderBy: { createdAt: 'asc' },
    });

    return { amount, movements: walletStatements };
  }
}
