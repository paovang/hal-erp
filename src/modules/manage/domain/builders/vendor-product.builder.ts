import { VendorProductEntity } from '../entities/vendor-product.entity';
import { VendorProductId } from '../value-objects/vendor-product-id.vo';

export class VendorProductBuilder {
  vendorProductId: VendorProductId;
  vendorId: number;
  productId: number;
  vendor?: { id: number; name: string };
  product?: { id: number; name: string };
  price: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setVendorProductId(value: VendorProductId): this {
    this.vendorProductId = value;
    return this;
  }

  setVendorId(vendorId: number): this {
    this.vendorId = vendorId;
    return this;
  }

  setProductId(productId: number): this {
    this.productId = productId;
    return this;
  }

  setVendor(vendor: { id: number; name: string }): this {
    this.vendor = vendor;
    return this;
  }

  setProduct(product: { id: number; name: string }): this {
    this.product = product;
    return this;
  }

  setPrice(price: number): this {
    this.price = price;
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

  build(): VendorProductEntity {
    return VendorProductEntity.create(this);
  }
}