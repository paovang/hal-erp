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
import { AuthUserInterceptor } from '@common/interceptors/auth/auth.interceptor';
import { TypeOrmRepositoryModule } from '@common/infrastructure/database/type-orm.module';
import { I18nModule } from '@common/infrastructure/localization/i18n.module';
import { ConfigModule } from '@nestjs/config';
import { PaginationModule } from '@common/infrastructure/pagination/pagination.module';
import { AmazonS3Module } from '@common/infrastructure/aws3/config/aws3.module';
import { ClsAuthModule } from '@common/infrastructure/cls/cls.module';
import { PermissionGuard } from './guards/permission.guard';
import { ExcelExportService } from './utils/excel-export.service';

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
    ClsAuthModule,
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
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    ExcelExportService,
  ],
  exports: [ExcelExportService],
})
export class CommonModule {}
