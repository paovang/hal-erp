import { ApprovalWorkflowOrmEntity } from './typeorm/approval-workflow.orm';
import { BudgetApprovalRuleOrmEntity } from './typeorm/budget-approval-rule.orm';
import { CategoryOrmEntity } from './typeorm/category.orm';
import { CurrencyOrmEntity } from './typeorm/currency.orm';
import { DepartmentApproverOrmEntity } from './typeorm/department-approver.orm';
import { DepartmentUserOrmEntity } from './typeorm/department-user.orm';
import { DepartmentOrmEntity } from './typeorm/department.orm';
import { DocumentTypeOrmEntity } from './typeorm/document-type.orm';
import { PermissionGroupOrmEntity } from './typeorm/permission-group.orm';
import { PermissionOrmEntity } from './typeorm/permission.orm';
import { PositionOrmEntity } from './typeorm/position.orm';
import { RoleOrmEntity } from './typeorm/role.orm';
import { SeederLogOrmEntity } from './typeorm/seeder-log.orm';
import { UnitOrmEntity } from './typeorm/unit.orm';
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
  // BudgetAccountOrmEntity,
  // SubBudgetAccountOrmEntity,
];
