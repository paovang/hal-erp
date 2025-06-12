import { PurchaseRequestEntity } from '../entities/purchase-request.entity';
import { PurchaseRequestId } from '../value-objects/purchase-request-id.vo';

export class PurchaseRequestBuilder {
  purchaseRequestId: PurchaseRequestId;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setPurchaseRequestId(value: PurchaseRequestId): this {
    this.purchaseRequestId = value;
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

  build(): PurchaseRequestEntity {
    return PurchaseRequestEntity.create(this);
  }
}
