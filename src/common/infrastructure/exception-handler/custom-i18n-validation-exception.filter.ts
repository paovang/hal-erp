import { ArgumentsHost, HttpStatus, ValidationError } from '@nestjs/common';
import {
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';

export class CustomI18nValidationExceptionFilter extends I18nValidationExceptionFilter {
  constructor() {
    super({
      detailedErrors: true,
      errorFormatter: (errors: ValidationError[]): object => {
        return errors; // Return original errors to handle in responseBodyFormatter
      },
      responseBodyFormatter: (
        host: ArgumentsHost,
        exc: I18nValidationException,
        formattedErrors: object,
      ): Record<string, unknown> => {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest();
        const errors = formattedErrors as ValidationError[];

        // Transform to Laravel style
        const customError: Record<string, string[]> = {};

        errors.forEach((error) => {
          if (error.constraints) {
            customError[error.property] = Object.values(error.constraints);
          }

          if (error.children?.length) {
            error.children.forEach((child) => {
              if (child.constraints) {
                customError[`${error.property}.${child.property}`] =
                  Object.values(child.constraints);
              }
            });
          }
        });

        return {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          timestamp: moment.tz(Timezone.LAOS).format('DD-MM-YYYY HH:mm:ss'),
          path: request.url,
          method: request.method,
          message: 'The given data was invalid.',
          errors: customError,
        };
      },
    });
  }
}
