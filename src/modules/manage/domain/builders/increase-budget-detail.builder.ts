import { IncreaseBudgetDetailEntity } from '../entities/increase-budget-detail.entity';
import { IncreaseBudgetDetailId } from '../value-objects/increase-budget-detail-id.vo';

export class IncreaseBudgetDetailBuilder {
  increaseBudgetDetailId: IncreaseBudgetDetailId;
  budget_item_id: number;
  allocated_amount: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setIncreaseBudgetDetailId(value: IncreaseBudgetDetailId): this {
    this.increaseBudgetDetailId = value;
    return this;
  }

  setBudgetItemId(budget_item_id: number): this {
    this.budget_item_id = budget_item_id;
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

  build(): IncreaseBudgetDetailEntity {
    return IncreaseBudgetDetailEntity.create(this);
  }
}
