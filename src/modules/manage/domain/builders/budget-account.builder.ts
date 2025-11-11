import { EnumBudgetType } from '../../application/constants/status-key.const';
import { BudgetAccountEntity } from '../entities/budget-account.entity';
import { CompanyEntity } from '../entities/company.entity';
import { DepartmentEntity } from '../entities/department.entity';
import { BudgetAccountId } from '../value-objects/budget-account-id.vo';

export class BudgetAccountBuilder {
  budgetAccountId: BudgetAccountId;
  code: string;
  name: string;
  departmentId: number;
  fiscal_year: number;
  allocated_amount: number;
  increase_amount: number;
  used_amount: number;
  balance_amount: number;
  total_budget: number;
  type: EnumBudgetType;
  company_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  department: DepartmentEntity | null;
  company: CompanyEntity | null;

  setBudgetAccountId(value: BudgetAccountId): this {
    this.budgetAccountId = value;
    return this;
  }

  setCode(code: string): this {
    this.code = code;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setDepartmentId(value: number): this {
    this.departmentId = value;
    return this;
  }

  setFiscalYear(fiscal_year: number): this {
    this.fiscal_year = fiscal_year;
    return this;
  }

  setAllocatedAmount(allocated_amount: number): this {
    this.allocated_amount = allocated_amount;
    return this;
  }

  setIncreaseAmount(increase_amount: number): this {
    this.increase_amount = increase_amount;
    return this;
  }

  setUsedAmount(used_amount: number): this {
    this.used_amount = used_amount;
    return this;
  }

  setCompanyId(company_id: number): this {
    this.company_id = company_id;
    return this;
  }

  setBalanceAmount(balance_amount: number): this {
    this.balance_amount = balance_amount;
    return this;
  }

  setTotalBudget(total_budget: number): this {
    this.total_budget = total_budget;
    return this;
  }

  setType(type: EnumBudgetType): this {
    this.type = type;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date | null): this {
    this.updatedAt = updatedAt;
    return this;
  }

  setDeletedAt(deletedAt: Date | null): this {
    this.deletedAt = deletedAt;
    return this;
  }

  setDepartment(department: DepartmentEntity | null): this {
    this.department = department;
    return this;
  }

  setCompany(company: CompanyEntity | null): this {
    this.company = company;
    return this;
  }

  build(): BudgetAccountEntity {
    return BudgetAccountEntity.create(this);
  }
}
