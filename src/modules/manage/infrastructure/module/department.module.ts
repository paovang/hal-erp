import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmRepositoryModule } from '@common/infrastructure/database/type-orm.module';
import { DepartmentController } from '@src/modules/manage/controllers/departmnent.controller';
import { AllRegisterProviders } from '@src/modules/manage/application/providers';
import { CqrsModule } from '@nestjs/cqrs';
import { PaginationModule } from '@src/common/infrastructure/pagination/pagination.module';
import { I18nModule } from '@src/common/infrastructure/localization/i18n.module';

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmRepositoryModule,
    I18nModule,
    PaginationModule,
  ],
  controllers: [DepartmentController],
  providers: [...AllRegisterProviders],
  exports: [...AllRegisterProviders],
})
export class DepartmentModule {}
