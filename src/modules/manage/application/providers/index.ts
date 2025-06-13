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
import { BudgetApprovalRuleProvider } from './budgetApprovalRule';
import { ApprovalWorkflowProvider } from './approvalWorkflow';
import { BudgetAccountProvider } from './budgetAccount';
import { BudgetItemProvider } from './budgetItem';
import { BudgetItemDetailProvider } from './budgetItemDetail';
import { ProvinceProvider } from './Province';
import { DocumentProvider } from './document';
import { UserSignatureProvider } from './userSignature';
import { ApprovalWorkflowStepProvider } from './approvalWorkflowStep';

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
