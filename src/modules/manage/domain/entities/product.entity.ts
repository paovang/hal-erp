import { Entity } from '@src/common/domain/entities/entity';
import { ProductId } from '../value-objects/product-id.vo';
import { ProductBuilder } from '../builders/product.builder';

export class ProductEntity extends Entity<ProductId> {
  private readonly _name: string;
  private readonly _description: string;
  private readonly _productTypeId: number;
  private readonly _unitId: number;
  private readonly _unit?: { id: number; name: string };
  private readonly _productType?: { id: number; name: string };
  private readonly _status: 'active' | 'inactive';
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: ProductBuilder) {
    super();
    this.setId(builder.productId);
    this._name = builder.name;
    this._description = builder.description;
    this._productTypeId = builder.productTypeId;
    this._productType = builder.productType;
    this._unitId = builder.unitId;
    this._unit = builder.unit;
    this._status = builder.status;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get productTypeId(): number {
    return this._productTypeId;
  }

  get productType(): { id: number; name: string } | undefined {
    return this._productType;
  }

  get unitId(): number {
    return this._unitId;
  }

  get unit(): { id: number; name: string } | undefined {
    return this._unit;
  }

  get status(): 'active' | 'inactive' {
    return this._status;
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

  public static builder(): ProductBuilder {
    return new ProductBuilder();
  }

  static create(builder: ProductBuilder): ProductEntity {
    return new ProductEntity(builder);
  }

  static getEntityName() {
    return 'product';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('product validation error');
    }
  }

  async initializeUpdateSetId(productId: ProductId) {
    this.setId(productId);
  }
}
