import { BudgetItemDetailEntity } from '../entities/budget-item-detail.entity';
import { BudgetItemEntity } from '../entities/budget-item.entity';
import { BudgetItemId } from '../value-objects/budget-item-id.vo';

export class BudgetItemBuilder {
  budgetItemId: BudgetItemId;
  name: string;
  budgetAccountId: number;
  allocated_amount: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  details: BudgetItemDetailEntity[] | null;

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

  setDetails(details: BudgetItemDetailEntity[] | null): this {
    this.details = details;
    return this;
  }

  build(): BudgetItemEntity {
    return BudgetItemEntity.create(this);
  }
}
