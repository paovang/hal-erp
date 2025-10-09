import { DocumentTransactionEntity } from '../entities/document-transaction.entity';
import { DocumentTransactionId } from '../value-objects/document-transaction-id.vo';
import { EnumDocumentTransactionType } from '../../application/constants/status-key.const';
import { BudgetItemDetailEntity } from '../entities/budget-item-detail.entity';

export class DocumentTransactionBuilder {
  documentTransactionId: DocumentTransactionId;
  document_id: number;
  budget_item_detail_id: number;
  transaction_number: string;
  amount: number;
  transaction_type: EnumDocumentTransactionType;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  budget_item_detail: BudgetItemDetailEntity | null;

  setDocumentTransactionId(value: DocumentTransactionId): this {
    this.documentTransactionId = value;
    return this;
  }

  setDocumentId(document_id: number): this {
    this.document_id = document_id;
    return this;
  }

  setBudgetItemDetailId(budget_item_detail_id: number): this {
    this.budget_item_detail_id = budget_item_detail_id;
    return this;
  }

  setTransactionNumber(transaction_number: string): this {
    this.transaction_number = transaction_number;
    return this;
  }

  setAmount(amount: number): this {
    this.amount = amount;
    return this;
  }

  setTransactionType(transaction_type: EnumDocumentTransactionType): this {
    this.transaction_type = transaction_type;
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

  build(): DocumentTransactionEntity {
    return DocumentTransactionEntity.create(this);
  }
}
