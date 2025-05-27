import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmRepositoryModule } from '@common/infrastructure/database/type-orm.module';
import { DepartmentController } from '@src/modules/manage/controllers/departmnent.controller';
import { AllRegisterProviders } from '@src/modules/manage/application/providers';
import { CqrsModule } from '@nestjs/cqrs';
import { PaginationModule } from '@src/common/infrastructure/pagination/pagination.module';
import { I18nModule } from '@src/common/infrastructure/localization/i18n.module';
import { DocumentTypeController } from '../../controllers/document-type.controller';
import { UserController } from '../../controllers/user.controller';
import { RoleController } from '../../controllers/role.controller';
import { PermissionController } from '../../controllers/permission.controller';
import { UnitController } from '../../controllers/unit.controller';
import { DepartmentUserController } from '../../controllers/department-user.controller';
import { PositionController } from '../../controllers/position.controller';
import { CategoryController } from '../../controllers/category.controller';
import { AmazonS3Module } from '@src/common/infrastructure/aws3/config/aws3.module';
import { DepartmentApproverController } from '../../controllers/department-approver.controller';
import { CurrencyController } from '../../controllers/currency.controller';
import { VendorController } from '../../controllers/vendor.controller';
import { VendorBankAccountController } from '../../controllers/vendor-bank-account.controller';

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
    AmazonS3Module.forRootAsync(),
  ],
  controllers: [
    DepartmentController,
    DocumentTypeController,
    UserController,
    RoleController,
    PermissionController,
    UnitController,
    DepartmentUserController,
    PositionController,
    CategoryController,
    DepartmentApproverController,
    CurrencyController,
    VendorController,
    VendorBankAccountController,
  ],
  providers: [...AllRegisterProviders],
  exports: [...AllRegisterProviders],
})
export class DepartmentModule {}
