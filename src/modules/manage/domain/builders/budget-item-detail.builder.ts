import { BudgetItemDetailEntity } from '../entities/budget-item-detail.entity';
import { BudgetItemDetailId } from '../value-objects/budget-item-detail-rule-id.vo';

export class BudgetItemDetailBuilder {
  budgetItemDetailId: BudgetItemDetailId;
  budgetItemId: number;
  name: string;
  provinceId: number;
  description: string;
  allocated_amount: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setBudgetItemDetailId(value: BudgetItemDetailId): this {
    this.budgetItemDetailId = value;
    return this;
  }

  setBudgetItemId(value: number): this {
    this.budgetItemId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setProvinceId(value: number): this {
    this.provinceId = value;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
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

  build(): BudgetItemDetailEntity {
    return BudgetItemDetailEntity.create(this);
  }
}
