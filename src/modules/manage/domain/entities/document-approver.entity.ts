import { Entity } from '@src/common/domain/entities/entity';
import { DocumentApproverId } from '../value-objects/document-approver-id.vo';
import { DocumentApproverBuilder } from '../builders/document-approver.builder';

export class DocumentApproverEntity extends Entity<DocumentApproverId> {
  private readonly _user_approval_step_id: number;
  private readonly _user_id: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;

  private constructor(builder: DocumentApproverBuilder) {
    super();
    this.setId(builder.documentApproverId);
    this._user_approval_step_id = builder.user_approval_step_id;
    this._user_id = builder.user_id;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
  }

  get user_approval_step_id(): number {
    return this._user_approval_step_id;
  }

  get user_id(): number {
    return this._user_id;
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

  public static builder(): DocumentApproverBuilder {
    return new DocumentApproverBuilder();
  }

  static create(builder: DocumentApproverBuilder): DocumentApproverEntity {
    return new DocumentApproverEntity(builder);
  }

  static getEntityName() {
    return 'DocumentApprover';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('paovang');
      // throw new UserDomainException(
      //   'users.user_is_not_in_correct_state_for_initialization',
      // );
    }
  }

  async initializeUpdateSetId(documentApproverId: DocumentApproverId) {
    this.setId(documentApproverId);
  }
}
