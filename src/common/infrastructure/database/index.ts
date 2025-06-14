import { ApprovalWorkflowStepOrmEntity } from './typeorm/approval-workflow-step.orm';
import { ApprovalWorkflowOrmEntity } from './typeorm/approval-workflow.orm';
import { BudgetAccountOrmEntity } from './typeorm/budget-account.orm';
import { BudgetApprovalRuleOrmEntity } from './typeorm/budget-approval-rule.orm';
import { BudgetItemDetailOrmEntity } from './typeorm/budget-item-detail.orm';
import { BudgetItemOrmEntity } from './typeorm/budget-item.orm';
import { CategoryOrmEntity } from './typeorm/category.orm';
import { CurrencyOrmEntity } from './typeorm/currency.orm';
import { DepartmentApproverOrmEntity } from './typeorm/department-approver.orm';
import { DepartmentUserOrmEntity } from './typeorm/department-user.orm';
import { DepartmentOrmEntity } from './typeorm/department.orm';
import { DocumentTypeOrmEntity } from './typeorm/document-type.orm';
import { DocumentOrmEntity } from './typeorm/document.orm';
import { UserHasPermissionOrmEntity } from './typeorm/model-has-permission.orm';
import { PermissionGroupOrmEntity } from './typeorm/permission-group.orm';
import { PermissionOrmEntity } from './typeorm/permission.orm';
import { PositionOrmEntity } from './typeorm/position.orm';
import { ProvinceOrmEntity } from './typeorm/province.orm';
import { PurchaseRequestItemOrmEntity } from './typeorm/purchase-request-item.orm';
import { PurchaseRequestOrmEntity } from './typeorm/purchase-request.orm';
import { RoleOrmEntity } from './typeorm/role.orm';
import { SeederLogOrmEntity } from './typeorm/seeder-log.orm';
import { UnitOrmEntity } from './typeorm/unit.orm';
import { UserSignatureOrmEntity } from './typeorm/user-signature.orm';
import { UserOrmEntity } from './typeorm/user.orm';
import { VendorOrmEntity } from './typeorm/vendor.orm';
import { VendorBankAccountOrmEntity } from './typeorm/vendor_bank_account.orm';

export const models = [
  DepartmentOrmEntity,
  SeederLogOrmEntity,
  DocumentTypeOrmEntity,
  UnitOrmEntity,
  DepartmentUserOrmEntity,
  PositionOrmEntity,
  UserOrmEntity,
  DepartmentApproverOrmEntity,
  RoleOrmEntity,
  PermissionOrmEntity,
  PermissionGroupOrmEntity,
  CurrencyOrmEntity,
  CategoryOrmEntity,
  VendorOrmEntity,
  VendorBankAccountOrmEntity,
  BudgetApprovalRuleOrmEntity,
  ApprovalWorkflowOrmEntity,
  ApprovalWorkflowStepOrmEntity,
  BudgetAccountOrmEntity,
  BudgetItemOrmEntity,
  ProvinceOrmEntity,
  BudgetItemDetailOrmEntity,
  UserHasPermissionOrmEntity,
  DocumentOrmEntity,
  PurchaseRequestOrmEntity,
  PurchaseRequestItemOrmEntity,
  UserSignatureOrmEntity,
];
