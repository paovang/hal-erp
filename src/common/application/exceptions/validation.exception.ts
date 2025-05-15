import { ApplicationException } from './application.exception';

export class ValidationException extends ApplicationException {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message, 'VALIDATION_ERROR');
  }
}
