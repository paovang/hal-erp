import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import moment from 'moment-timezone';
import { OptimisticLockVersionMismatchError } from 'typeorm';
import { DomainException } from '@src/common/domain/exceptions/domain.exception';
import { LOCALIZATION_SERVICE } from '@src/common/constants/inject-key.const';
import { ILocalizationService } from '@src/common/application/interfaces/localization.interface';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { log } from 'console';

@Injectable()
@Catch(HttpException, DomainException, Error)
export abstract class BaseGlobalExceptionFilter implements ExceptionFilter {
  constructor(
    protected configService: ConfigService,
    @Inject(LOCALIZATION_SERVICE)
    protected readonly localizationService: ILocalizationService,
    // @Inject(SLACK_PRODUCER_SERVICE)
    // protected readonly slackService: ISlackNotificationProducer,
    // @Inject(AUTH_ALS_SERVICE_KEY)
    // protected readonly authAlsService: AuthAlsService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = this.determineStatus(exception);
    const message = this.extractMessage(exception);
    const context = this.extractHttpExceptionDetails(exception).context;
    const localizedMessage =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? await this.localizationService.translate(message, context)
        : message;
    // const environment =
    //   this.configService.get<string>('NODE_ENV') ?? 'development';
    // const timestamp = moment
    //   .tz(Timezone.LAOS)
    //   .format(DateFormat.DATETIME_READABLE_FORMAT);
    // const ip =
    //   (request.ip as string) ||
    //   (request.headers['x-forwarded-for'] as string) ||
    //   'unknown';
    // const userAgent = request.headers['user-agent'] ?? 'unknown';
    // const correlationId =
    //   (request.headers['x-correlation-id'] as string) ?? 'no-correlation-id';

    // let userId = 'unknown';
    try {
      //   userId = this.authAlsService.get('user_id') as string;
    } catch (error) {
      // Ignore error
    }

    // const sanitizedBody = this.sanitizeRequestBody(request.body);

    // if (this.shouldNotify(status, exception)) {
    //   await this.slackService.enqueueSlackNotification({
    //     status,
    //     message: localizedMessage,
    //     stack: exception instanceof Error ? exception.stack : undefined,
    //     url: request.url,
    //     method: request.method,
    //     timestamp,
    //     environment,
    //     ip,
    //     userAgent,
    //     userId,
    //     correlationId,
    //     queryParams: request.query,
    //     routeParams: request.params,
    //     requestBody: sanitizedBody,
    //   });
    // }

    response.status(status).json({
      statusCode: status,
      timestamp: moment
        .tz(Timezone.LAOS)
        .format(DateFormat.DATETIME_READABLE_FORMAT),
      path: request.url,
      method: request.method,
      message: localizedMessage,
    });
  }

  protected determineStatus(exception: unknown): HttpStatus {
    if (exception instanceof HttpException) {
      return exception.getStatus();
    } else if (exception instanceof DomainException) {
      return exception.statusCode;
    } else if (exception instanceof OptimisticLockVersionMismatchError) {
      return HttpStatus.CONFLICT;
    }
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  protected extractMessage(exception: unknown): string {
    if (exception instanceof HttpException) {
      return 'errors.' + this.formatMessageKey(exception.message);
    } else if (exception instanceof DomainException) {
      return exception.message;
    } else if (
      exception instanceof Error &&
      this.configService.getOrThrow<string>('NODE_ENV') != 'production'
    ) {
      return exception.message;
    } else if (exception instanceof OptimisticLockVersionMismatchError) {
      return 'errors.the_resource_was_updated_by_another_transaction';
    } else {
      return 'errors.unexpected';
    }
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  // protected shouldNotify(status: HttpStatus, _exception: unknown): boolean {
  //   return status !== 404;
  // }
  /* eslint-enable @typescript-eslint/no-unused-vars */

  protected extractHttpExceptionDetails(exception: unknown): {
    messageKey: unknown;
    context: object | undefined;
  } {
    let messageKey: unknown = 'errors.unexpected';
    let context: object | undefined = undefined;

    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      messageKey =
        typeof response === 'object' &&
        response !== null &&
        'message' in response
          ? response['message']
          : messageKey;
      context =
        typeof response === 'object' &&
        response !== null &&
        'context' in response
          ? (response['context'] as object)
          : undefined;
    } else if (exception instanceof DomainException) {
      messageKey = exception.message;
      context = exception.context || undefined;
    }

    return { messageKey, context };
  }

  protected formatMessageKey(message: unknown): string {
    const key = message as string;
    const formattedKey = key.toLowerCase().replace(/ /g, '_');
    const pattern = /^cannot_(get|post|put|delete|fetch).*/;
    if (pattern.test(formattedKey)) {
      return 'route_not_found';
    } else {
      return formattedKey;
    }
  }

  protected sanitizeRequestBody(body: any): any {
    const sanitizedBody = { ...body };
    const sensitiveFields = this.getSensitiveFields();

    for (const field of sensitiveFields) {
      if (sanitizedBody[field]) {
        sanitizedBody[field] = '***REDACTED***';
      }
    }

    return sanitizedBody;
  }

  protected getSensitiveFields(): string[] {
    return ['password', 'secretToken', 'idToken', 'pin', 'image', 'file'];
  }
}
