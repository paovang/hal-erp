import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@common/domain/exceptions/domain.exception';

export class ManageDomainException extends DomainException {
  constructor(
    message: string,
    status?: HttpStatus,
    translationArgs?: Record<string, string>,
    cause?: Error,
  ) {
    super(message, status, translationArgs, cause);
  }
}
