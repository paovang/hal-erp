import { EnumWorkflowStep } from '../../application/constants/status-key.const';
import { ApprovalWorkflowStepEntity } from '../entities/approval-workflow-step.entity';
import { DepartmentEntity } from '../entities/department.entity';
import { UserEntity } from '../entities/user.entity';
import { ApprovalWorkflowStepId } from '../value-objects/approval-workflow-step-id.vo';

export class ApprovalWorkflowStepBuilder {
  approvalWorkflowStepId: ApprovalWorkflowStepId;
  approval_workflow_id: number;
  step_name: string;
  step_number: number;
  department_id: number;
  user_id: number;
  type: EnumWorkflowStep;
  requires_file: boolean;
  is_otp: boolean;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  department: DepartmentEntity | null;
  user: UserEntity | null;

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

  setUserId(user_id: number): this {
    this.user_id = user_id;
    return this;
  }

  setType(type: EnumWorkflowStep): this {
    this.type = type;
    return this;
  }

  setRequiresFile(requires_file: boolean): this {
    this.requires_file = requires_file;
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

  setDepartment(department: DepartmentEntity | null): this {
    this.department = department;
    return this;
  }

  setUser(user: UserEntity | null): this {
    this.user = user;
    return this;
  }

  build(): ApprovalWorkflowStepEntity {
    return ApprovalWorkflowStepEntity.create(this);
  }
}
