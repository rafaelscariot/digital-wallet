import { BadRequestException, NotFoundException } from '@nestjs/common';

export class WalletError {
  static NOT_FOUND(prop: string): NotFoundException {
    return new NotFoundException(`${prop.toUpperCase()}_NOT_FOUND`);
  }
  static INVALID_PAYLOAD(prop: string): BadRequestException {
    return new BadRequestException('INVALID_PAYLOAD');
  }
}
