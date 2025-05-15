import { Module } from '@nestjs/common';
import { TransformResponseInterceptor } from './interceptors/transform-response.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';

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
  ],
})
export class CommonModule {}
