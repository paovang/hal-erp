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
import { BudgetItemController } from '../../controllers/budget-item.controller';
import { BudgetItemDetailController } from '../../controllers/budget-item-detail.controller';
import { ProvinceController } from '../../controllers/province.controller';
import { DocumentController } from '../../controllers/document.controller';
import { ApprovalWorkflowStepController } from '../../controllers/approval-workflow-step.controller';
import { PurchaseRequestController } from '../../controllers/purchase-request.controller';
import { PurchaseOrderController } from '../../controllers/purchase-order.controller';
import { UserApprovalController } from '../../controllers/user-approval.controller';
import { UserApprovalStepController } from '../../controllers/user-approval-step.controller';
import { VatController } from '../../controllers/vat.controller';
import { ReceiptController } from '../../controllers/receipt.controller';
import { ExchangeRateController } from '../../controllers/exchange-rate.controller';
import { BankController } from '../../controllers/bank.controller';

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
    BudgetItemController,
    BudgetItemDetailController,
    ProvinceController,
    DocumentController,
    ApprovalWorkflowStepController,
    PurchaseRequestController,
    PurchaseOrderController,
    UserApprovalController,
    UserApprovalStepController,
    VatController,
    ReceiptController,
    ExchangeRateController,
    BankController,
  ],
  providers: [...AllRegisterProviders],
  exports: [...AllRegisterProviders],
})
export class ManageModule {}
