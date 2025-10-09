import { BudgetItemEntity } from '../entities/budget-item.entity';
import { IncreaseBudgetDetailEntity } from '../entities/increase-budget-detail.entity';
import { IncreaseBudgetDetailId } from '../value-objects/increase-budget-detail-id.vo';

export class IncreaseBudgetDetailBuilder {
  increaseBudgetDetailId: IncreaseBudgetDetailId;
  budget_item_id: number;
  increase_budget_id: number;
  allocated_amount: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  budget_item: BudgetItemEntity | null;

  setIncreaseBudgetDetailId(value: IncreaseBudgetDetailId): this {
    this.increaseBudgetDetailId = value;
    return this;
  }

  setBudgetItemId(budget_item_id: number): this {
    this.budget_item_id = budget_item_id;
    return this;
  }

  setIncreaseBudgetId(increase_budget_id: number): this {
    this.increase_budget_id = increase_budget_id;
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

  setBudgetItem(budget_item: BudgetItemEntity | null): this {
    this.budget_item = budget_item;
    return this;
  }

  build(): IncreaseBudgetDetailEntity {
    return IncreaseBudgetDetailEntity.create(this);
  }
}
