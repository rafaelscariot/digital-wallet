import { CreateWalletDTO } from '@wallet/dto';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/service';

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
