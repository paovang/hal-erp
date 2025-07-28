import { DocumentAttachmentEntity } from '../entities/document-attachment.entity';
import { UserEntity } from '../entities/user.entity';
import { DocumentAttachmentId } from '../value-objects/document-attachment-id.vo';

export class DocumentAttachmentBuilder {
  documentAttachmentId: DocumentAttachmentId;
  document_id: number;
  file_name: string;
  created_by: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  created_by_user: UserEntity | null;

  setDocumentAttachmentId(value: DocumentAttachmentId): this {
    this.documentAttachmentId = value;
    return this;
  }
  setDocumentId(document_id: number): this {
    this.document_id = document_id;
    return this;
  }

  setFileName(file_name: string): this {
    this.file_name = file_name;
    return this;
  }

  setCreatedBy(created_by: number): this {
    this.created_by = created_by;
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

  setCreatedByUser(created_by_user: UserEntity | null): this {
    this.created_by_user = created_by_user;
    return this;
  }

  build(): DocumentAttachmentEntity {
    return DocumentAttachmentEntity.create(this);
  }
}
