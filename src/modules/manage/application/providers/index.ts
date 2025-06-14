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
];
