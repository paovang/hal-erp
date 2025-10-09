import { DocumentEntity } from '@src/modules/manage/domain/entities/document.entity';
import { PurchaseOrderItemEntity } from '@src/modules/manage/domain/entities/purchase-order-item.entity';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { UserApprovalEntity } from '@src/modules/manage/domain/entities/user-approval.entity';
import { ReportPurchaseOrderEntity } from '../entities/report-purchase-order.entity';
import { ReportPurchaseOrderId } from '../value-objects/report-purchase-order-id.vo';

export class ReportPurchaseOrderBuilder {
  purchaseOrderId: ReportPurchaseOrderId;
  document_id: number;
  purchase_request_id: number;
  po_number: string;
  order_date: Date;
  expired_date: Date;
  purposes: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  sub_total: number | 0;
  vat: number | 0;
  total: number | 0;
  purchaseRequest: PurchaseRequestEntity | null;
  orderItem: PurchaseOrderItemEntity[] | null;
  document: DocumentEntity | null;
  user_approval: UserApprovalEntity | null;
  step: number | 0;

  setPurchaseOrderId(value: ReportPurchaseOrderId): this {
    this.purchaseOrderId = value;
    return this;
  }

  setPurchaseRequestId(purchase_request_id: number): this {
    this.purchase_request_id = purchase_request_id;
    return this;
  }

  setDocumentId(document_id: number): this {
    this.document_id = document_id;
    return this;
  }

  setPoNumber(po_number: string): this {
    this.po_number = po_number;
    return this;
  }

  setOrderDate(order_date: Date): this {
    this.order_date = order_date;
    return this;
  }

  setExpiredDate(expired_date: Date): this {
    this.expired_date = expired_date;
    return this;
  }

  setPurposes(purposes: string): this {
    this.purposes = purposes;
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

  setSubTotal(sub_total: number | 0): this {
    this.sub_total = sub_total;
    return this;
  }

  setVat(vat: number | 0): this {
    this.vat = vat;
    return this;
  }

  setTotal(total: number | 0): this {
    this.total = total;
    return this;
  }

  setStep(step: number | 0): this {
    this.step = step;
    return this;
  }

  setPurchaseRequest(purchaseRequest: PurchaseRequestEntity | null): this {
    this.purchaseRequest = purchaseRequest;
    return this;
  }

  setOrderItem(orderItem: PurchaseOrderItemEntity[] | null): this {
    this.orderItem = orderItem;
    return this;
  }

  setDocument(document: DocumentEntity | null): this {
    this.document = document;
    return this;
  }

  setUserApproval(user_approval: UserApprovalEntity | null): this {
    this.user_approval = user_approval;
    return this;
  }

  build(): ReportPurchaseOrderEntity {
    return ReportPurchaseOrderEntity.create(this);
  }
}
