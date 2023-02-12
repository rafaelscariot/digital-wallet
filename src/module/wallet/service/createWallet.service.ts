import { CreateWalletDTO } from '@dto/index';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@shared/index';

@Injectable()
export class CreateWalletService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(CreateWalletService.name);

  async perform({ amount }): Promise<CreateWalletDTO> {
    this.logger.log(`Creating a wallet with the amount ${amount.toFixed(2)}`);

    return this.prismaService.wallet.create({
      data: {
        amount,
      },
    });
  }
}
