import { HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

export function assertOrThrow(
  condition: any,
  message: string,
  status: HttpStatus = HttpStatus.BAD_REQUEST,
): void {
  if (!condition) {
    throw new ManageDomainException(message, status);
  }
}
