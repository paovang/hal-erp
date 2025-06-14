import { Entity } from '@src/common/domain/entities/entity';
import { ApprovalWorkflowStepId } from '../value-objects/approval-workflow-step-id.vo';
import { ApprovalWorkflowStepBuilder } from '../builders/approval-workflow-step.builder';
import { DepartmentEntity } from './department.entity';

export class ApprovalWorkflowStepEntity extends Entity<ApprovalWorkflowStepId> {
  private readonly _step_name: string;
  private readonly _approval_workflow_id: number;
  private readonly _step_number: number;
  private readonly _department_id: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _department: DepartmentEntity | null;

  private constructor(builder: ApprovalWorkflowStepBuilder) {
    super();
    this.setId(builder.approvalWorkflowStepId);
    this._step_name = builder.step_name;
    this._approval_workflow_id = builder.approval_workflow_id;
    this._step_number = builder.step_number;
    this._department_id = builder.department_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._department = builder.department ?? null;
  }

  get step_name(): string {
    return this._step_name;
  }

  get approval_workflow_id(): number {
    return this._approval_workflow_id;
  }

  get step_number(): number {
    return this._step_number;
  }

  get department_id(): number {
    return this._department_id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date | null {
    return this._updatedAt;
  }

  get deletedAt(): Date | null {
    return this._deletedAt;
  }

  get department(): DepartmentEntity | null {
    return this._department;
  }

  public static builder(): ApprovalWorkflowStepBuilder {
    return new ApprovalWorkflowStepBuilder();
  }

  static create(
    builder: ApprovalWorkflowStepBuilder,
  ): ApprovalWorkflowStepEntity {
    return new ApprovalWorkflowStepEntity(builder);
  }

  static getEntityName() {
    return 'approval_workflow';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(approvalWorkflowStepId: ApprovalWorkflowStepId) {
    this.setId(approvalWorkflowStepId);
  }
}
