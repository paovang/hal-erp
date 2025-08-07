import { BudgetAccountEntity } from '../entities/budget-account.entity';
import { IncreaseBudgetEntity } from '../entities/increase-budget.entity';
import { UserEntity } from '../entities/user.entity';
import { IncreaseBudgetId } from '../value-objects/increase-budget-id.vo';

export class IncreaseBudgetBuilder {
  increaseBudgetId: IncreaseBudgetId;
  budget_account_id: number;
  allocated_amount: number;
  description: string;
  import_date: Date | null;
  created_by: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  budget_account: BudgetAccountEntity | null;
  created_by_user: UserEntity | null;

  setIncreaseBudgetId(value: IncreaseBudgetId): this {
    this.increaseBudgetId = value;
    return this;
  }

  setBudgetAccountId(budget_account_id: number): this {
    this.budget_account_id = budget_account_id;
    return this;
  }

  setAllocatedAmount(allocated_amount: number): this {
    this.allocated_amount = allocated_amount;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setImportDate(import_date: Date | null): this {
    this.import_date = import_date;
    return this;
  }

  setCreatedBy(created_by: number): this {
    this.created_by = created_by;
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

  setBudgetAccount(budget_account: BudgetAccountEntity | null): this {
    this.budget_account = budget_account;
    return this;
  }

  setCreatedByUser(created_by_user: UserEntity | null): this {
    this.created_by_user = created_by_user;
    return this;
  }

  build(): IncreaseBudgetEntity {
    return IncreaseBudgetEntity.create(this);
  }
}
