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
  quota_company_id: number;
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

  setPurchaseRequestId(purchase_request_id: number): this {
    this.purchase_request_id = purchase_request_id;
    return this;
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setFileName(file_name: any): this {
    this.file_name = file_name;
    return this;
  }

  setQuantity(quantity: number): this {
    this.quantity = quantity;
    return this;
  }

  setUnitId(unit_id: number): this {
    this.unit_id = unit_id;
    return this;
  }

  setQuotaCompanyId(quota_company_id: number): this {
    this.quota_company_id = quota_company_id;
    return this;
  }

  setPrice(price: number): this {
    this.price = price;
    return this;
  }

  setTotalPrice(total_price: number): this {
    this.total_price = total_price;
    return this;
  }

  setRemark(remark: string): this {
    this.remark = remark;
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
