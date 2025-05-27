import { VendorEntity } from '../entities/vendor.entity';
import { VendorId } from '../value-objects/vendor-id.vo';

export class VendorBuilder {
  vendorId: VendorId;
  name: string;
  contact_info: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setVendorId(value: VendorId): this {
    this.vendorId = value;
    return this;
  }

  setName(name: string): this {
    this.name = name;
    return this;
  }

  setContactInfo(contact_info: string): this {
    this.contact_info = contact_info;
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

  build(): VendorEntity {
    return VendorEntity.create(this);
  }
}
