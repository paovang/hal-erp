import { ApprovalWorkflowStepEntity } from '../entities/approval-workflow-step.entity';
import { DocumentApproverEntity } from '../entities/document-approver.entity';
import { DocumentStatusEntity } from '../entities/document-status.entity';
import { PositionEntity } from '../entities/position.entity';
import { UserApprovalStepEntity } from '../entities/user-approval-step.entity';
import { UserEntity } from '../entities/user.entity';
import { UserApprovalStepId } from '../value-objects/user-approval-step-id.vo';

export class UserApprovalStepBuilder {
  userApprovalStepId: UserApprovalStepId;
  user_approval_id: number;
  step_number: number;
  approver_id: number;
  approved_at: Date | null;
  status_id: number;
  remark: string;
  requires_file_upload: boolean;
  is_otp: boolean;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  status: DocumentStatusEntity | null;
  user: UserEntity | null;
  approvalWorkflowStep: ApprovalWorkflowStepEntity | null;
  position: PositionEntity[] | null;
  doc_approver: DocumentApproverEntity[] | null;

  setUserApprovalStepId(value: UserApprovalStepId): this {
    this.userApprovalStepId = value;
    return this;
  }

  setUserApprovalId(user_approval_id: number): this {
    this.user_approval_id = user_approval_id;
    return this;
  }

  setStepNumber(step_number: number): this {
    this.step_number = step_number;
    return this;
  }

  setApproverId(approver_id: number): this {
    this.approver_id = approver_id;
    return this;
  }

  setApprovedAt(approved_at: Date | null): this {
    this.approved_at = approved_at;
    return this;
  }

  setStatusId(status_id: number): this {
    this.status_id = status_id;
    return this;
  }

  setRemark(remark: string): this {
    this.remark = remark;
    return this;
  }

  setRequiresFileUpload(requires_file_upload: boolean): this {
    this.requires_file_upload = requires_file_upload;
    return this;
  }

  setIsOtp(is_otp: boolean): this {
    this.is_otp = is_otp;
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

  setApprover(user: UserEntity | null): this {
    this.user = user;
    return this;
  }

  setPosition(position: PositionEntity[] | null): this {
    this.position = position;
    return this;
  }

  setApprovalWorkflowStep(
    approvalWorkflowStep: ApprovalWorkflowStepEntity | null,
  ): this {
    this.approvalWorkflowStep = approvalWorkflowStep;
    return this;
  }

  setDocApprover(doc_approver: DocumentApproverEntity[] | null): this {
    this.doc_approver = doc_approver;
    return this;
  }

  build(): UserApprovalStepEntity {
    return UserApprovalStepEntity.create(this);
  }
}
