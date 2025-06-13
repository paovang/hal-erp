import { ApprovalWorkflowStepEntity } from '../entities/approval-workflow-step.entity';
import { ApprovalWorkflowStepId } from '../value-objects/approval-workflow-step-id.vo';

export class ApprovalWorkflowStepBuilder {
  approvalWorkflowStepId: ApprovalWorkflowStepId;
  approval_workflow_id: number;
  step_name: string;
  step_number: number;
  department_id: number;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;

  setApprovalWorkflowStepId(value: ApprovalWorkflowStepId): this {
    this.approvalWorkflowStepId = value;
    return this;
  }

  setApprovalWorkflowId(approval_workflow_id: number): this {
    this.approval_workflow_id = approval_workflow_id;
    return this;
  }

  setStepName(step_name: string): this {
    this.step_name = step_name;
    return this;
  }

  setStepNumber(step_number: number): this {
    this.step_number = step_number;
    return this;
  }

  setDepartmentId(department_id: number): this {
    this.department_id = department_id;
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

  build(): ApprovalWorkflowStepEntity {
    return ApprovalWorkflowStepEntity.create(this);
  }
}
