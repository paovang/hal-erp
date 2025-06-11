import { DocumentEntity } from '../entities/document.entity';
import { DocumentId } from '../value-objects/document-id.vo';

export class DocumentBuilder {
  documentId: DocumentId;
  document_number: string;
  title: string;
  description: string;
  total_amount: number;
  department_id: number;
  requester_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setDocumentId(value: DocumentId): this {
    this.documentId = value;
    return this;
  }

  setDocumentNumber(document_number: string): this {
    this.document_number = document_number;
    return this;
  }

  setTitle(title: string): this {
    this.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.description = description;
    return this;
  }

  setTotalAmount(total_amount: number): this {
    this.total_amount = total_amount;
    return this;
  }

  setDepartmentId(department_id: number): this {
    this.department_id = department_id;
    return this;
  }

  setRequesterId(requester_id: number): this {
    this.requester_id = requester_id;
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

  build(): DocumentEntity {
    return DocumentEntity.create(this);
  }
}
