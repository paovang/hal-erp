import { DocumentCategoryEntity } from '../entities/document-category.entity';
import { DocumentTypeEntity } from '../entities/document-type.entity';
import { DocumentTypeId } from '../value-objects/document-type-id.vo';

export class DocumentTypeBuilder {
  documentTypeId: DocumentTypeId;
  code: string;
  name: string;
  categoryId: number;
  category: DocumentCategoryEntity;
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

  setCategoryId(categoryId: number): this {
    this.categoryId = categoryId;
    return this;
  }

  setCategory(category: DocumentCategoryEntity): this {
    this.category = category;
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
