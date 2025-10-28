import { Entity } from '@src/common/domain/entities/entity';
import { ProductTypeId } from '../value-objects/product-type-id.vo';
import { ProductTypeBuilder } from '../builders/product-type.builder';

export class ProductTypeEntity extends Entity<ProductTypeId> {
  private readonly _code: string;
  private readonly _name: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: ProductTypeBuilder) {
    super();
    this.setId(builder.productTypeId);
    this._name = builder.name;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get name(): string {
    return this._name;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  public static builder(): ProductTypeBuilder {
    return new ProductTypeBuilder();
  }

  static create(builder: ProductTypeBuilder): ProductTypeEntity {
    return new ProductTypeEntity(builder);
  }

  static getEntityName() {
    return 'product-type';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('product-type validation error');
    }
  }

  async initializeUpdateSetId(productTypeId: ProductTypeId) {
    this.setId(productTypeId);
  }
}