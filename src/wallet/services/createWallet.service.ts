import { CreateWalletDTO } from '@dto/wallet.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';

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
