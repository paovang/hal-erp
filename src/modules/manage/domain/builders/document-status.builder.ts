import { DocumentStatusEntity } from '../entities/document-status.entity';
import { DocumentStatusId } from '../value-objects/document-status-id.vo';

export class DocumentStatusBuilder {
  documentStatusId: DocumentStatusId;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setDocumentStatusId(value: DocumentStatusId): this {
    this.documentStatusId = value;
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

  build(): DocumentStatusEntity {
    return DocumentStatusEntity.create(this);
  }
}
