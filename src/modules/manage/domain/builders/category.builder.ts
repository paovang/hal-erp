import { CategoryEntity } from '../entities/category.entity';
import { CategoryId } from '../value-objects/category-id.vo';

export class CategoryBuilder {
  categoryId: CategoryId;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setCategoryId(value: CategoryId): this {
    this.categoryId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
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

  build(): CategoryEntity {
    return CategoryEntity.create(this);
  }
}
