import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmRepositoryModule } from '@common/infrastructure/database/type-orm.module';
import { AllRegisterProviders } from '@src/modules/manage/application/providers';
import { CqrsModule } from '@nestjs/cqrs';
import { PaginationModule } from '@src/common/infrastructure/pagination/pagination.module';
import { I18nModule } from '@src/common/infrastructure/localization/i18n.module';
import { DocumentTypeController } from '../../controllers/document-type.controller';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';

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
  controllers: [DocumentTypeController],
  providers: [...AllRegisterProviders],
  exports: [...AllRegisterProviders],
})
export class DocumentTypeModule {}
