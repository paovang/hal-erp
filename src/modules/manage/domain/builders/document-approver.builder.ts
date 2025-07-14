import { DocumentApproverEntity } from '../entities/document-approver.entity';
import { DocumentApproverId } from '../value-objects/document-approver-id.vo';

export class DocumentApproverBuilder {
  documentApproverId: DocumentApproverId;
  user_approval_step_id: number;
  user_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setDocumentApproverId(value: DocumentApproverId): this {
    this.documentApproverId = value;
    return this;
  }

  setUserApprovalStepId(user_approval_step_id: number): this {
    this.user_approval_step_id = user_approval_step_id;
    return this;
  }

  setUserId(user_id: number): this {
    this.user_id = user_id;
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

  build(): DocumentApproverEntity {
    return DocumentApproverEntity.create(this);
  }
}
