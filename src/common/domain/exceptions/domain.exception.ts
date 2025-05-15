import { HttpStatus } from '@nestjs/common';

export class DomainException<TContext = any> extends Error {
  public readonly cause?: Error;
  public readonly context?: TContext;
  public readonly statusCode: HttpStatus;

  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
    context?: TContext,
    cause?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
    this.statusCode = statusCode;
    this.context = context;
    this.cause = cause;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      cause: this.cause?.message,
      context: this.context,
      stack: this.stack,
    };
  }
}
