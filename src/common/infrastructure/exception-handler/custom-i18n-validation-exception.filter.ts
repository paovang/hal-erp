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

        // errors.forEach((error) => {
        //   if (error.constraints) {
        //     customError[error.property] = Object.values(error.constraints);
        //   }

        //   if (error.children?.length) {
        //     error.children.forEach((child) => {
        //       if (child.constraints) {
        //         customError[`${error.property}.${child.property}`] =
        //           Object.values(child.constraints);
        //       }
        //     });
        //   }
        // });

        const processValidationError = (
          error: ValidationError,
          parentPath = '',
        ): void => {
          const currentPath = parentPath
            ? `${parentPath}.${error.property}`
            : error.property;

          // Handle array validation for approval_rules
          if (error.property === 'approval_rules') {
            if (!error.value || error.value.length === 0) {
              customError[currentPath] = ['ກະລຸນາເພີ່ມຢ່າງໜ້ອຍ 1 ລາຍການ'];
              return;
            }
          }

          if (error.constraints) {
            customError[currentPath] = Object.values(error.constraints);
          }

          if (error.children && error.children.length > 0) {
            const isArrayValidation = error.children?.some(
              (child) => !isNaN(Number(child.property)),
            );

            if (isArrayValidation) {
              error.children.forEach((child) => {
                const arrayPath = `${currentPath}[${child.property}]`;

                if (!child.value || Object.keys(child.value).length === 0) {
                  customError[arrayPath] = ['ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ'];
                }

                if (child.constraints) {
                  customError[arrayPath] = Object.values(child.constraints);
                }

                if (child.children?.length) {
                  child.children.forEach((nestedChild) =>
                    processValidationError(nestedChild, arrayPath),
                  );
                }
              });
            } else {
              error.children.forEach((child) => {
                processValidationError(child, currentPath);
              });
            }
          }
        };

        errors.forEach((error) => processValidationError(error));

        // Remove empty arrays
        Object.keys(customError).forEach((key) => {
          if (
            Array.isArray(customError[key]) &&
            customError[key].length === 0
          ) {
            delete customError[key];
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
