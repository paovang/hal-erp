import { ProductTypeEntity } from '../entities/product-type.entity';
import { ProductTypeId } from '../value-objects/product-type-id.vo';

export class ProductTypeBuilder {
  productTypeId: ProductTypeId;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setProductTypeId(value: ProductTypeId): this {
    this.productTypeId = value;
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

  build(): ProductTypeEntity {
    return ProductTypeEntity.create(this);
  }
}