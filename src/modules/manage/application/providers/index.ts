import { DepartmentProvider } from './department';
import { Provider } from '@nestjs/common';
import { DocumentTypeProvider } from './documentType';
import { UserProvider } from './user';
import { UnitProvider } from './unit';
import { DepartmentUserProvider } from './departmentUser';
import { PositionProvider } from './position';
import { CategoryProvider } from './category';
import { DepartmentApproverProvider } from './departmentApprover';
import { CurrencyProvider } from './currency';
import { VendorProvider } from './vendor';
import { VendorBankAccountProvider } from './vendorBankAccount';
import { ProvinceProvider } from './Province';
import { UserSignatureProvider } from './userSignature';
import { ApprovalWorkflowStepProvider } from './approvalWorkflowStep';
import { BudgetApprovalRuleProvider } from './BudgetApprovalRule';
import { ApprovalWorkflowProvider } from './ApprovalWorkflow';
import { BudgetAccountProvider } from './BudgetAccount';
import { BudgetItemProvider } from './BudgetItem';
import { BudgetItemDetailProvider } from './BudgetItemDetail';
import { DocumentProvider } from './Document';
import { PurchaseRequestProvider } from './purchaseRequest';
import { PurchaseRequestItemProvider } from './purchaseRequestItem';
import { UserApprovalProvider } from './userApproval';
import { UserApprovalStepProvider } from './userApprovalStep';
import { DocumentStatusProvider } from './documentStatus';
import { PurchaseOrderProvider } from './purchaseOrder';
import { PurchaseOrderItemProvider } from './purchaseOrderItem';
import { PurchaseOrderSelectedVendorProvider } from './purchaseOrderSelectedVendor';
import { VatProvider } from './vat';
import { DocumentApproverProvider } from './documentApprover';
import { ReceiptProvider } from './receipt';
import { ReceiptItemProvider } from './receiptItem';
import { ExchangeRateProvider } from './exchange-rates';
import { BankProvider } from './banks';
import { DocumentAttachmentProvider } from './documentAttachment';
import { DocumentTransactionProvider } from './documentTransaction';
export const AllRegisterProviders: Provider[] = [
  ...DepartmentProvider,
  ...DocumentTypeProvider,
  ...UserProvider,
  ...UnitProvider,
  ...DepartmentUserProvider,
  ...PositionProvider,
  ...CategoryProvider,
  ...DepartmentApproverProvider,
  ...CurrencyProvider,
  ...VendorProvider,
  ...VendorBankAccountProvider,
  ...BudgetApprovalRuleProvider,
  ...ApprovalWorkflowProvider,
  ...BudgetAccountProvider,
  ...ProvinceProvider,
  ...BudgetItemProvider,
  ...BudgetItemDetailProvider,
  ...DocumentProvider,
  ...UserSignatureProvider,
  ...ApprovalWorkflowStepProvider,
  ...PurchaseRequestProvider,
  ...PurchaseRequestItemProvider,
  ...UserApprovalProvider,
  ...UserApprovalStepProvider,
  ...DocumentStatusProvider,
  ...PurchaseOrderProvider,
  ...PurchaseOrderItemProvider,
  ...PurchaseOrderSelectedVendorProvider,
  ...VatProvider,
  ...DocumentApproverProvider,
  ...ReceiptProvider,
  ...ReceiptItemProvider,
  ...ExchangeRateProvider,
  ...BankProvider,
  ...DocumentAttachmentProvider,
  ...DocumentTransactionProvider,
];
