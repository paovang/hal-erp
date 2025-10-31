import { Entity } from '@src/common/domain/entities/entity';
import { VendorProductId } from '../value-objects/vendor-product-id.vo';
import { VendorProductBuilder } from '../builders/vendor-product.builder';

export class VendorProductEntity extends Entity<VendorProductId> {
  private readonly _vendorId: number;
  private readonly _productId: number;
  private readonly _vendor?: { id: number; name: string };
  private readonly _product?: { id: number; name: string };
  private readonly _price: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: VendorProductBuilder) {
    super();
    this.setId(builder.vendorProductId);
    this._vendorId = builder.vendorId;
    this._productId = builder.productId;
    this._vendor = builder.vendor;
    this._product = builder.product;
    this._price = builder.price;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get vendorId(): number {
    return this._vendorId;
  }

  get productId(): number {
    return this._productId;
  }

  get vendor(): { id: number; name: string } | undefined {
    return this._vendor;
  }

  get product(): { id: number; name: string } | undefined {
    return this._product;
  }

  get price(): number {
    return this._price;
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

  public static builder(): VendorProductBuilder {
    return new VendorProductBuilder();
  }

  static create(builder: VendorProductBuilder): VendorProductEntity {
    return new VendorProductEntity(builder);
  }

  static getEntityName() {
    return 'vendor-product';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('vendor-product validation error');
    }
  }

  async initializeUpdateSetId(vendorProductId: VendorProductId) {
    this.setId(vendorProductId);
  }
}