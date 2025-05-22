import { Module } from '@nestjs/common';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { CodeGeneratorUtil } from './utils/code-generator.util';
import { GENERTE_CODE_SERVICE } from './constants/inject-key.const';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: GENERTE_CODE_SERVICE,
      useClass: CodeGeneratorUtil,
    },
  ],
})
export class CommonModule {}
