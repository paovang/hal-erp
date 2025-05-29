import { Global, Module } from '@nestjs/common';
import { TransformResponseInterceptor } from '@common/interceptors/transform-response.interceptor';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  Reflector,
} from '@nestjs/core';
import { GlobalExceptionFilter } from '@common/filters/global-exception.filter';
import { JwtAuthGuard } from '@core-system/auth';
import { UserContextService } from '@common/utils/services/cls/cls.service';
import { AuthUserInterceptor } from '@common/interceptors/auth/auth.interceptor';
import { ClsModule } from 'nestjs-cls';
import { TypeOrmRepositoryModule } from '@common/infrastructure/database/type-orm.module';
import { I18nModule } from '@common/infrastructure/localization/i18n.module';
import { ConfigModule } from '@nestjs/config';
import { PaginationModule } from '@common/infrastructure/pagination/pagination.module';
import { AmazonS3Module } from './infrastructure/aws3/config/aws3.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    PaginationModule,
    AmazonS3Module.forRootAsync(),
    I18nModule,
    TypeOrmRepositoryModule,
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        idGenerator: () => {
          // ສ້າງ unique ID ສຳຫລັບເເຕ່ລະ request
          return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },
      },
    }),
  ],
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
      useClass: AuthUserInterceptor,
    },
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) => new JwtAuthGuard(reflector),
      inject: [Reflector],
    },
    UserContextService,
  ],
  exports: [UserContextService],
})
export class CommonModule {}
