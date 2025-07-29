import { Entity } from '@src/common/domain/entities/entity';
import { DocumentTransactionId } from '../value-objects/document-transaction-id.vo';
import { DocumentTransactionBuilder } from '../builders/document-transaction.builder';
import { EnumDocumentTransactionType } from '../../application/constants/status-key.const';
import { BudgetItemDetailEntity } from './budget-item-detail.entity';

export class DocumentTransactionEntity extends Entity<DocumentTransactionId> {
  private readonly _document_id: number;
  private readonly _budget_item_detail_id: number;
  private readonly _transaction_number: string;
  private readonly _amount: number;
  private readonly _transaction_type: EnumDocumentTransactionType;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _budget_item_detail: BudgetItemDetailEntity | null;

  private constructor(builder: DocumentTransactionBuilder) {
    super();
    this.setId(builder.documentTransactionId);
    this._document_id = builder.document_id;
    this._budget_item_detail_id = builder.budget_item_detail_id;
    this._transaction_number = builder.transaction_number;
    this._amount = builder.amount;
    this._transaction_type = builder.transaction_type;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._budget_item_detail = builder.budget_item_detail ?? null;
  }

  get document_id(): number {
    return this._document_id;
  }

  get budget_item_detail_id(): number {
    return this._budget_item_detail_id;
  }

  get transaction_number(): string {
    return this._transaction_number;
  }

  get amount(): number {
    return this._amount;
  }

  get transaction_type(): EnumDocumentTransactionType {
    return this._transaction_type;
  }

  get budget_item_detail(): BudgetItemDetailEntity | null {
    return this._budget_item_detail;
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

  public static builder(): DocumentTransactionBuilder {
    return new DocumentTransactionBuilder();
  }

  static create(
    builder: DocumentTransactionBuilder,
  ): DocumentTransactionEntity {
    return new DocumentTransactionEntity(builder);
  }

  static getEntityName() {
    return 'document_status';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(documentTransactionId: DocumentTransactionId) {
    this.setId(documentTransactionId);
  }
}
