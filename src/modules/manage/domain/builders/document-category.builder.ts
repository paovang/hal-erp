import { DocumentCategoryCode } from '@src/common/infrastructure/database/typeorm/document-category.orm';
import { DocumentCategoryEntity } from '../entities/document-category.entity';
import { DocumentCategoryId } from '../value-objects/document-category-id.vo';

export class DocumentCategoryBuilder {
  documentCategoryId: DocumentCategoryId;
  code: DocumentCategoryCode;
  name: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setDocumentCategoryId(value: DocumentCategoryId): this {
    this.documentCategoryId = value;
    return this;
  }

  setCode(code: DocumentCategoryCode): this {
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

  build(): DocumentCategoryEntity {
    return DocumentCategoryEntity.create(this);
  }
}
