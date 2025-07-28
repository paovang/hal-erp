import { Entity } from '@src/common/domain/entities/entity';
import { UserApprovalStepId } from '../value-objects/user-approval-step-id.vo';
import { BadRequestException } from '@nestjs/common';
import { UserApprovalStepBuilder } from '../builders/user-approval-step.builder';
import { DocumentStatusEntity } from './document-status.entity';
import { UserEntity } from './user.entity';
import { ApprovalWorkflowStepEntity } from './approval-workflow-step.entity';

export class UserApprovalStepEntity extends Entity<UserApprovalStepId> {
  private readonly _user_approval_id: number;
  private readonly _step_number: number;
  private readonly _approver_id: number;
  private readonly _approved_at: Date | null;
  private readonly _status_id: number;
  private readonly _remark: string;
  private readonly _requires_file_upload: boolean;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _status: DocumentStatusEntity | null;
  private readonly _user: UserEntity | null;
  private readonly _approvalWorkflowStep: ApprovalWorkflowStepEntity | null;

  private constructor(builder: UserApprovalStepBuilder) {
    super();
    this.setId(builder.userApprovalStepId);
    this._user_approval_id = builder.user_approval_id;
    this._step_number = builder.step_number;
    this._approver_id = builder.approver_id;
    this._approved_at = builder.approved_at;
    this._status_id = builder.status_id;
    this._remark = builder.remark;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._status = builder.status ?? null;
    this._user = builder.user ?? null;
    this._approvalWorkflowStep = builder.approvalWorkflowStep ?? null;
    this._requires_file_upload = builder.requires_file_upload;
  }

  get user_approval_id(): number {
    return this._user_approval_id;
  }

  get step_number(): number {
    return this._step_number;
  }

  get approver_id(): number {
    return this._approver_id;
  }

  get approved_at(): Date | null {
    return this._approved_at;
  }

  get status_id(): number {
    return this._status_id;
  }

  get remark(): string {
    return this._remark;
  }

  get requires_file_upload(): boolean {
    return this._requires_file_upload;
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

  get status(): DocumentStatusEntity | null {
    return this._status;
  }

  get user(): UserEntity | null {
    return this._user;
  }

  get approvalWorkflowStep(): ApprovalWorkflowStepEntity | null {
    return this._approvalWorkflowStep;
  }

  public static builder(): UserApprovalStepBuilder {
    return new UserApprovalStepBuilder();
  }

  static create(builder: UserApprovalStepBuilder): UserApprovalStepEntity {
    return new UserApprovalStepEntity(builder);
  }

  static getEntityName() {
    return 'unit';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(userApprovalStepID: UserApprovalStepId) {
    this.setId(userApprovalStepID);
  }
}
