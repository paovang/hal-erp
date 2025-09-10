import { CurrencyTotal } from '../../application/commands/receipt/interface/receipt.interface';
import { DocumentAttachmentEntity } from '../entities/document-attachment.entity';
import { DocumentEntity } from '../entities/document.entity';
import { ReceiptItemEntity } from '../entities/receipt-item.entity';
import { ReceiptEntity } from '../entities/receipt.entity';
import { UserApprovalEntity } from '../entities/user-approval.entity';
import { ReceiptId } from '../value-objects/receitp-id.vo';

export class ReceiptBuilder {
  receiptId: ReceiptId;
  receipt_number: string;
  purchase_order_id: number;
  document_id: number;
  receipt_date: Date | null;
  received_by: number;
  remark: string;
  account_code: string | null;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  item: ReceiptItemEntity[] | null;
  document: DocumentEntity | null;
  user_approval: UserApprovalEntity | null;
  currency_totals?: CurrencyTotal[] | null;
  document_attachments?: DocumentAttachmentEntity[] | null;
  step: number | 0;

  setReceiptId(value: ReceiptId): this {
    this.receiptId = value;
    return this;
  }

  setReceiptNumber(receipt_number: string): this {
    this.receipt_number = receipt_number;
    return this;
  }

  setPurchaseOrderId(purchase_order_id: number): this {
    this.purchase_order_id = purchase_order_id;
    return this;
  }

  setDocumentId(document_id: number): this {
    this.document_id = document_id;
    return this;
  }

  setAccountCode(account_code: string | null): this {
    this.account_code = account_code;
    return this;
  }

  setReceiptDate(receipt_date: Date | null): this {
    this.receipt_date = receipt_date;
    return this;
  }

  setReceivedBy(received_by: number): this {
    this.received_by = received_by;
    return this;
  }

  setRemark(remark: string): this {
    this.remark = remark;
    return this;
  }

  setDocumentAttachments(
    document_attachments: DocumentAttachmentEntity[] | null,
  ): this {
    this.document_attachments = document_attachments;
    return this;
  }

  setStep(step: number | 0): this {
    this.step = step;
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

  setCurrencyTotals(currency_totals: CurrencyTotal[] | null): this {
    this.currency_totals = currency_totals;
    return this;
  }

  setItems(item: ReceiptItemEntity[] | null): this {
    this.item = item;
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

  build(): ReceiptEntity {
    return ReceiptEntity.create(this);
  }
}
