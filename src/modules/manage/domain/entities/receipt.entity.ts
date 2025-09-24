import { Entity } from '@src/common/domain/entities/entity';
import { ReceiptId } from '../value-objects/receitp-id.vo';
import { BadRequestException } from '@nestjs/common';
import { ReceiptBuilder } from '../builders/receipt.builder';
import { ReceiptItemEntity } from './receipt-item.entity';
import { DocumentEntity } from './document.entity';
import { UserApprovalEntity } from './user-approval.entity';
import { CurrencyTotal } from '../../application/commands/receipt/interface/receipt.interface';
import { DocumentAttachmentEntity } from './document-attachment.entity';

export class ReceiptEntity extends Entity<ReceiptId> {
  private readonly _receipt_number: string;
  private readonly _purchase_order_id: number;
  private readonly _document_id: number;
  private readonly _receipt_date: Date | null;
  private readonly _received_by: number;
  private readonly _remark: string;
  private readonly _account_code: string | null;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _item: ReceiptItemEntity[] | null;
  private readonly _document: DocumentEntity | null;
  private readonly _user_approval: UserApprovalEntity | null;
  private readonly _currency_totals?: CurrencyTotal[] | null;
  private readonly _document_attachments?: DocumentAttachmentEntity[] | null;
  private readonly _purchase_request_id: number;
  private _step: number | 0;
  private readonly _po_number: string;
  private readonly _pr_number: string;
  private readonly _po_doc_type: string;
  private readonly _pr_doc_type: string;

  private constructor(builder: ReceiptBuilder) {
    super();
    this.setId(builder.receiptId);
    this._receipt_number = builder.receipt_number;
    this._purchase_order_id = builder.purchase_order_id;
    this._document_id = builder.document_id;
    this._receipt_date = builder.receipt_date;
    this._received_by = builder.received_by;
    this._remark = builder.remark;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._item = builder.item ?? null;
    this._document = builder.document ?? null;
    this._user_approval = builder.user_approval ?? null;
    this._currency_totals = builder.currency_totals ?? null;
    this._account_code = builder.account_code ?? null;
    this._document_attachments = builder.document_attachments ?? null;
    this._step = builder.step;
    this._purchase_request_id = builder.purchase_request_id;
    this._po_number = builder.po_number;
    this._pr_number = builder.pr_number;
    this._po_doc_type = builder.po_doc_type;
    this._pr_doc_type = builder.pr_doc_type;
  }

  get receipt_number(): string {
    return this._receipt_number;
  }

  get purchase_order_id(): number {
    return this._purchase_order_id;
  }

  get po_number(): string {
    return this._po_number;
  }

  get pr_number(): string {
    return this._pr_number;
  }

  get po_doc_type(): string {
    return this._po_doc_type;
  }

  get pr_doc_type(): string {
    return this._pr_doc_type;
  }

  get document_id(): number {
    return this._document_id;
  }

  get receipt_date(): Date | null {
    return this._receipt_date;
  }

  get received_by(): number {
    return this._received_by;
  }

  get account_code(): string | null {
    return this._account_code;
  }

  get remark(): string {
    return this._remark;
  }

  get purchase_request_id(): number {
    return this._purchase_request_id;
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

  get currencyTotals(): CurrencyTotal[] | null {
    return this._currency_totals ?? null;
  }

  get step(): number | 0 {
    return this._step;
  }

  get item(): ReceiptItemEntity[] | null {
    return this._item;
  }

  get document(): DocumentEntity | null {
    return this._document;
  }

  get document_attachments(): DocumentAttachmentEntity[] | null {
    return this._document_attachments ?? null;
  }

  get user_approval(): UserApprovalEntity | null {
    return this._user_approval;
  }

  public static builder(): ReceiptBuilder {
    return new ReceiptBuilder();
  }

  static create(builder: ReceiptBuilder): ReceiptEntity {
    return new ReceiptEntity(builder);
  }

  static getEntityName() {
    return 'ReceiptEntity';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(receiptId: ReceiptId) {
    this.setId(receiptId);
  }
}
