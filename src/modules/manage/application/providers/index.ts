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
import { BudgetApprovalRuleProvider } from './BudgetApprovalRule';
import { ApprovalWorkflowProvider } from './ApprovalWorkflow';

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
];
