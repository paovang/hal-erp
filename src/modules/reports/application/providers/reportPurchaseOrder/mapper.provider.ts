import { Provider } from '@nestjs/common';
import { ReportPurchaseOrderDataAccessMapper } from '@src/modules/reports/infrastructure/mappers/report-purchase-order.mapper';
import { DocumentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document.mapper';
import { DepartmentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/department.mapper';
import { UserDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user.mapper';
import { PositionDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/position.mapper';
import { DocumentTypeDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-type.mapper';
import { RoleDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/role.mapper';
import { PermissionDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/permission.mapper';
import { UserTypeDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-type.mapper';
import { UserSignatureDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-signature.mapper';
import { DocumentDataMapper } from '@src/modules/manage/application/mappers/document.mapper';
import { DepartmentDataMapper } from '@src/modules/manage/application/mappers/department.mapper';
import { UserDataMapper } from '@src/modules/manage/application/mappers/user.mapper';
import { PositionDataMapper } from '@src/modules/manage/application/mappers/position.mapper';
import { RoleDataMapper } from '@src/modules/manage/application/mappers/role.mapper';
import { UserTypeDataMapper } from '@src/modules/manage/application/mappers/user-type.mapper';
import { UserSignatureDataMapper } from '@src/modules/manage/application/mappers/user-signature.mapper';
import { DocumentTypeDataMapper } from '@src/modules/manage/application/mappers/document-type.mapper';
import { PermissionDataMapper } from '@src/modules/manage/application/mappers/permission.mapper';
import { UnitDataMapper } from '@src/modules/manage/application/mappers/unit.mapper';
import { UnitDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/unit.mapper';
import { ReportPurchaseOrderDataMapper } from '../../mappers/report-purchase-order.mapper';
import { ReportPurchaseOrderItemDataMapper } from '../../mappers/report-purchase-order-item.mapper';
import { ReportPurchaseOrderItemDataAccessMapper } from '@src/modules/reports/infrastructure/mappers/report-purchase-order-item.mapper';
import { PurchaseOrderItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-order-item.mapper';
import { PurchaseOrderItemDataMapper } from '@src/modules/manage/application/mappers/purchase-order-item.mapper';
import { PurchaseRequestDataMapper } from '@src/modules/manage/application/mappers/purchase-request.mapper';
import { UserApprovalDataMapper } from '@src/modules/manage/application/mappers/user-approval.mapper';
import { BudgetItemDataMapper } from '@src/modules/manage/application/mappers/budget-item.mapper';
import { PurchaseRequestItemDataMapper } from '@src/modules/manage/application/mappers/purchase-request-item.mapper';
import { PurchaseOrderSelectedVendorDataMapper } from '@src/modules/manage/application/mappers/purchase-order-selected-vendor.mapper';
import { BudgetItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-item.mapper';
import { PurchaseRequestItemDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-request-item.mapper';
import { PurchaseOrderSelectedVendorDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/purchase-order-selected-vendor.mapper';
import { UserApprovalStepDataMapper } from '@src/modules/manage/application/mappers/user-approval-step.mapper';
import { DocumentStatusDataMapper } from '@src/modules/manage/application/mappers/document-status.mapper';
import { BudgetItemDetailDataMapper } from '@src/modules/manage/application/mappers/budget-item-detail.mapper';
import { BudgetAccountDataMapper } from '@src/modules/manage/application/mappers/budget-account.mapper';
import { VendorDataMapper } from '@src/modules/manage/application/mappers/vendor.mapper';
import { VendorBankAccountDataMapper } from '@src/modules/manage/application/mappers/vendor-bank-account.mapper';
import { BudgetItemDetailDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-item-detail.mapper';
import { BudgetAccountDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/budget-account.mapper';
import { VendorDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/vendor.mapper';
import { VendorBankAccountDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/vendor-bank-account.mapper';
import { DocumentApproverDataMapper } from '@src/modules/manage/application/mappers/document-approver.mapper';
import { ProvinceDataMapper } from '@src/modules/manage/application/mappers/province.mapper';
import { CurrencyDataMapper } from '@src/modules/manage/application/mappers/currency.mapper';
import { BankDataMapper } from '@src/modules/manage/application/mappers/bank.mapper';
import { ProvinceDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/province.mapper';
import { CurrencyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/currency.mapper';
import { BankDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/bank.mapper';
import { UserApprovalDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-approval.mapper';
import { UserApprovalStepDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/user-approval-step.mapper';
import { DocumentStatusDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-status.mapper';
import { DocumentApproverDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-approver.mapper';

export const ReportPurchaseOrderMapperProviders: Provider[] = [
  ReportPurchaseOrderDataAccessMapper,
  ReportPurchaseOrderDataMapper,
  ReportPurchaseOrderItemDataMapper,
  ReportPurchaseOrderItemDataAccessMapper,
  DocumentDataAccessMapper,
  DepartmentDataAccessMapper,
  UserDataAccessMapper,
  PositionDataAccessMapper,
  DocumentTypeDataAccessMapper,
  RoleDataAccessMapper,
  PermissionDataAccessMapper,
  UserTypeDataAccessMapper,
  UserSignatureDataAccessMapper,
  DocumentDataMapper,
  DepartmentDataMapper,
  UserDataMapper,
  PositionDataMapper,
  DocumentTypeDataMapper,
  RoleDataMapper,
  PermissionDataMapper,
  UserTypeDataMapper,
  UserSignatureDataMapper,
  UnitDataMapper,
  UnitDataAccessMapper,
  PurchaseOrderItemDataAccessMapper,
  PurchaseOrderItemDataMapper,
  PurchaseRequestDataMapper,
  UserApprovalDataMapper,
  BudgetItemDataMapper,
  PurchaseRequestItemDataMapper,
  PurchaseOrderSelectedVendorDataMapper,
  BudgetItemDataAccessMapper,
  PurchaseRequestItemDataAccessMapper,
  PurchaseOrderSelectedVendorDataAccessMapper,
  UserApprovalStepDataMapper,
  DocumentStatusDataMapper,
  BudgetItemDetailDataMapper,
  BudgetAccountDataMapper,
  VendorDataMapper,
  VendorBankAccountDataMapper,
  BudgetItemDetailDataAccessMapper,
  BudgetAccountDataAccessMapper,
  VendorDataAccessMapper,
  VendorBankAccountDataAccessMapper,
  DocumentApproverDataMapper,
  ProvinceDataMapper,
  CurrencyDataMapper,
  BankDataMapper,
  ProvinceDataAccessMapper,
  CurrencyDataAccessMapper,
  BankDataAccessMapper,
  UserApprovalDataAccessMapper,
  UserApprovalStepDataAccessMapper,
  DocumentStatusDataAccessMapper,
  DocumentApproverDataAccessMapper,
];
