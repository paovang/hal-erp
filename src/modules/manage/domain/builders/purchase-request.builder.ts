import { DocumentEntity } from '../entities/document.entity';
import { PurchaseRequestItemEntity } from '../entities/purchase-request-item.entity';
import { PurchaseRequestEntity } from '../entities/purchase-request.entity';
import { UserApprovalEntity } from '../entities/user-approval.entity';
import { PurchaseRequestId } from '../value-objects/purchase-request-id.vo';

export class PurchaseRequestBuilder {
  purchaseRequestId: PurchaseRequestId;
  document_id: number;
  pr_number: string;
  requested_date: Date;
  expired_date: Date;
  purposes: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  total: number | 0;
  purchaseRequestItem: PurchaseRequestItemEntity[] | null;
  document: DocumentEntity | null;
  user_approval: UserApprovalEntity | null;

  setPurchaseRequestId(value: PurchaseRequestId): this {
    this.purchaseRequestId = value;
    return this;
  }

  setDocumentId(value: number): this {
    this.document_id = value;
    return this;
  }

  setPrNumber(pr_number: string): this {
    this.pr_number = pr_number;
    return this;
  }

  setRequestedDate(requested_date: Date): this {
    this.requested_date = requested_date;
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

  setTotal(total: number | 0): this {
    this.total = total;
    return this;
  }

  setUserApproval(user_approval: UserApprovalEntity | null): this {
    this.user_approval = user_approval;
    return this;
  }

  setPurchaseRequestItem(
    purchaseRequestItem: PurchaseRequestItemEntity[] | null,
  ): this {
    this.purchaseRequestItem = purchaseRequestItem;
    return this;
  }

  setDocument(document: DocumentEntity | null): this {
    this.document = document;
    return this;
  }

  build(): PurchaseRequestEntity {
    return PurchaseRequestEntity.create(this);
  }
}
