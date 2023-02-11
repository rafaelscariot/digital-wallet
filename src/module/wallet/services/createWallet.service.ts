import { CreateWalletDTO } from '@dto/index';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/index';

@Injectable()
export class CreateWalletService {
  constructor(private readonly prismaService: PrismaService) {}

  async perform({ amount }): Promise<CreateWalletDTO> {
    return this.prismaService.wallet.create({
      data: {
        amount,
      },
    });
  }
}
