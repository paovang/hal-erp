import { Entity } from '@src/common/domain/entities/entity';
import { UserApprovalId } from '../value-objects/user-approval-id.vo';
import { BadRequestException } from '@nestjs/common';
import { UserApprovalBuilder } from '../builders/user-approval.builder';
import { UserApprovalStepEntity } from './user-approval-step.entity';
import { DocumentStatusEntity } from './document-status.entity';

export class UserApprovalEntity extends Entity<UserApprovalId> {
  private readonly _document_id: number;
  private readonly _approval_workflow_id: number;
  private readonly _status_id: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _status: DocumentStatusEntity | null;
  private readonly _userApprovalSteps: UserApprovalStepEntity[] | null;

  private constructor(builder: UserApprovalBuilder) {
    super();
    this.setId(builder.userApprovalId);
    this._document_id = builder.document_id;
    this._approval_workflow_id = builder.approval_workflow_id;
    this._status_id = builder.status_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._userApprovalSteps = builder.user_approval_step ?? null;
    this._status = builder.status ?? null;
  }

  get document_id(): number {
    return this._document_id;
  }

  get approval_workflow_id(): number {
    return this._approval_workflow_id;
  }

  get status_id(): number {
    return this._status_id;
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

  get userApprovalSteps(): UserApprovalStepEntity[] | null {
    return this._userApprovalSteps;
  }

  public static builder(): UserApprovalBuilder {
    return new UserApprovalBuilder();
  }

  static create(builder: UserApprovalBuilder): UserApprovalEntity {
    return new UserApprovalEntity(builder);
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

  async initializeUpdateSetId(userApprovalID: UserApprovalId) {
    this.setId(userApprovalID);
  }
}
