import { DocumentAttachmentEntity } from '../entities/document-attachment.entity';
import { DocumentAttachmentId } from '../value-objects/document-attachment-id.vo';

export class DocumentAttachmentBuilder {
  documentAttachmentId: DocumentAttachmentId;
  user_approval_step_id: number;
  user_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

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

  build(): DocumentAttachmentEntity {
    return DocumentAttachmentEntity.create(this);
  }
}
