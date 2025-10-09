import { DocumentStatusEntity } from '../entities/document-status.entity';
import { UserApprovalStepEntity } from '../entities/user-approval-step.entity';
import { UserApprovalEntity } from '../entities/user-approval.entity';
import { UserApprovalId } from '../value-objects/user-approval-id.vo';

export class UserApprovalBuilder {
  userApprovalId: UserApprovalId;
  document_id: number;
  status_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  status: DocumentStatusEntity | null;
  user_approval_step: UserApprovalStepEntity[] | null;

  setUserApprovalId(value: UserApprovalId): this {
    this.userApprovalId = value;
    return this;
  }

  setDocumentId(document_id: number): this {
    this.document_id = document_id;
    return this;
  }

  setStatusId(status_id: number): this {
    this.status_id = status_id;
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

  setStatus(status: DocumentStatusEntity | null): this {
    this.status = status;
    return this;
  }

  setUserApprovalStep(user_approval_step: UserApprovalStepEntity[]): this {
    this.user_approval_step = user_approval_step;
    return this;
  }

  build(): UserApprovalEntity {
    return UserApprovalEntity.create(this);
  }
}
