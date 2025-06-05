import { Module } from '@nestjs/common';
import { DepartmentController } from '@src/modules/manage/controllers/departmnent.controller';
import { AllRegisterProviders } from '@src/modules/manage/application/providers';
import { CqrsModule } from '@nestjs/cqrs';
import { DocumentTypeController } from '../../controllers/document-type.controller';
import { UserController } from '../../controllers/user.controller';
import { RoleController } from '../../controllers/role.controller';
import { PermissionController } from '../../controllers/permission.controller';
import { UnitController } from '../../controllers/unit.controller';
import { DepartmentUserController } from '../../controllers/department-user.controller';
import { PositionController } from '../../controllers/position.controller';
import { CategoryController } from '../../controllers/category.controller';
import { DepartmentApproverController } from '../../controllers/department-approver.controller';
import { CurrencyController } from '../../controllers/currency.controller';
import { VendorController } from '../../controllers/vendor.controller';
import { VendorBankAccountController } from '../../controllers/vendor-bank-account.controller';
import { BudgetApprovalRuleController } from '../../controllers/budget-approval-rule.controller';
import { CoreAuthModule } from '@core-system/auth';
import { UserService } from '@src/common/infrastructure/auth/user.service';
import { UserModule } from '@src/common/infrastructure/auth/user.module';
import { ApprovalWorkflowController } from '../../controllers/approval-workflow.controller';
import { BudgetAccountController } from '../../controllers/budget-account.controller';

@Module({
  imports: [
    CqrsModule,
    UserModule,
    CoreAuthModule.registerAsync({
      provide: 'USER_SERVICE',
      useExisting: UserService,
      imports: [UserModule],
    }),
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
    BudgetApprovalRuleController,
    ApprovalWorkflowController,
    BudgetAccountController,
  ],
  providers: [...AllRegisterProviders],
  exports: [...AllRegisterProviders],
})
export class ManageModule {}
