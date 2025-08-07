import { IncreaseBudgetFileEntity } from '../entities/increase-budget-file.entity';
import { IncreaseBudgetFileId } from '../value-objects/increase-budget-file-id.vo';

export class IncreaseBudgetFileBuilder {
  increaseBudgetFileId: IncreaseBudgetFileId;
  file_name: string;
  increase_budget_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setIncreaseBudgetFileId(value: IncreaseBudgetFileId): this {
    this.increaseBudgetFileId = value;
    return this;
  }

  setFileName(file_name: string): this {
    this.file_name = file_name;
    return this;
  }

  setIncreaseBudgetId(increase_budget_id: number): this {
    this.increase_budget_id = increase_budget_id;
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

  build(): IncreaseBudgetFileEntity {
    return IncreaseBudgetFileEntity.create(this);
  }
}
