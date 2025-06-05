import { BudgetAccountEntity } from '../entities/budget-account.entity';
import { DepartmentEntity } from '../entities/department.entity';
import { BudgetAccountId } from '../value-objects/budget-account-id.vo';

export class BudgetAccountBuilder {
  budgetAccountId: BudgetAccountId;
  code: string;
  name: string;
  departmentId: number;
  fiscal_year: number;
  allocated_amount: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  department: DepartmentEntity | null;

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

  build(): BudgetAccountEntity {
    return BudgetAccountEntity.create(this);
  }
}
