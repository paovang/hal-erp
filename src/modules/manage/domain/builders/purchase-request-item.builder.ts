import { PurchaseRequestItemEntity } from '../entities/purchase-request-item.entity';
import { UnitEntity } from '../entities/unit.entity';
import { PurchaseRequestItemId } from '../value-objects/purchase-request-item-id.vo';

export class PurchaseRequestItemBuilder {
  purchaseRequestItemId: PurchaseRequestItemId;
  purchase_request_id: number;
  title: string;
  file_name: string;
  quantity: number;
  unit_id: number;
  price: number;
  total_price: number;
  remark: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  unit: UnitEntity | null;

  setPurchaseRequestItemId(value: PurchaseRequestItemId): this {
    this.purchaseRequestItemId = value;
    return this;
  }

  setPurchaseRequestId(value: number): this {
    this.purchase_request_id = value;
    return this;
  }

  setTitle(value: string): this {
    this.title = value;
    return this;
  }

  setFileName(value: any): this {
    this.file_name = value;
    return this;
  }

  setQuantity(value: number): this {
    this.quantity = value;
    return this;
  }

  setUnitId(value: number): this {
    this.unit_id = value;
    return this;
  }

  setPrice(value: number): this {
    this.price = value;
    return this;
  }

  setTotalPrice(value: number): this {
    this.total_price = value;
    return this;
  }

  setRemark(value: string): this {
    this.remark = value;
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

  setUnit(unit: UnitEntity | null): this {
    this.unit = unit;
    return this;
  }

  build(): PurchaseRequestItemEntity {
    return PurchaseRequestItemEntity.create(this);
  }
}
