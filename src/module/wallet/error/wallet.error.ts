import { NotFoundException } from '@nestjs/common';

export class WalletError {
  static NOT_FOUND(prop: string): NotFoundException {
    return new NotFoundException(`${prop.toUpperCase()}_NOT_FOUND`);
  }
}
