import { Module } from '@nestjs/common';
import { TransformResponseInterceptor } from '@common/interceptors/transform-response.interceptor';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  Reflector,
} from '@nestjs/core';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { JwtAuthGuard } from '@core-system/auth';
import { UserEnhancementInterceptor } from './middleware/user.middleware';

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
      provide: APP_INTERCEPTOR,
      useClass: UserEnhancementInterceptor,
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
      inject: [Reflector],
    },
  ],
  exports: [],
})
export class CommonModule {}
