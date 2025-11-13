import { ProductEntity } from '../entities/product.entity';
import { ProductId } from '../value-objects/product-id.vo';

export class ProductBuilder {
  productId: ProductId;
  name: string;
  description: string;
  productTypeId: number;
  productType?: { id: number; name: string };
  unitId: number;
  unit?: { id: number; name: string };
  status: 'active' | 'inactive';
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setProductId(value: ProductId): this {
    this.productId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setProductTypeId(productTypeId: number): this {
    this.productTypeId = productTypeId;
    return this;
  }

  setProductType(productType: { id: number; name: string }): this {
    this.productType = productType;
    return this;
  }

  setUnitId(unitId: number): this {
    this.unitId = unitId;
    return this;
  }

  setUnit(unit: { id: number; name: string }): this {
    this.unit = unit;
    return this;
  }

  setStatus(status: 'active' | 'inactive'): this {
    this.status = status;
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



  build(): ProductEntity {
    return ProductEntity.create(this);
  }
}
