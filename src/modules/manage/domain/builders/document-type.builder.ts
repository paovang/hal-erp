import { DocumentTypeEntity } from '../entities/document-type.entity';
import { DocumentTypeId } from '../value-objects/document-type-id.vo';

export class DocumentTypeBuilder {
  documentTypeId: DocumentTypeId;
  code: string;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setDocumentTypeId(value: DocumentTypeId): this {
    this.documentTypeId = value;
    return this;
  }

  setCode(code: string): this {
    this.code = code;
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

  build(): DocumentTypeEntity {
    return DocumentTypeEntity.create(this);
  }
}
