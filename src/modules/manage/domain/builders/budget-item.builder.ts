import { BudgetAccountEntity } from '../entities/budget-account.entity';
import { BudgetItemEntity } from '../entities/budget-item.entity';
import { BudgetItemId } from '../value-objects/budget-item-id.vo';

export class BudgetItemBuilder {
  budgetItemId: BudgetItemId;
  name: string;
  budgetAccountId: number;
  allocated_amount: number;
  description: string | null;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  // details: BudgetItemDetailEntity[] | null;
  count_details: number | null;
  budgetAccount: BudgetAccountEntity | null;

  setBudgetItemId(value: BudgetItemId): this {
    this.budgetItemId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setBudgetAccountId(value: number): this {
    this.budgetAccountId = value;
    return this;
  }

  setAllocatedAmount(allocated_amount: number): this {
    this.allocated_amount = allocated_amount;
    return this;
  }

  setDescription(description: string | null): this {
    this.description = description;
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

  setBudgetAccount(budgetAccount: BudgetAccountEntity | null): this {
    this.budgetAccount = budgetAccount;
    return this;
  }

  setCountDetails(count_details: number | null): this {
    this.count_details = count_details;
    return this;
  }

  build(): BudgetItemEntity {
    return BudgetItemEntity.create(this);
  }
}
