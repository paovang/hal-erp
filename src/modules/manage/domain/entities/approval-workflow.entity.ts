import { Entity } from '@src/common/domain/entities/entity';
import { ApprovalWorkflowId } from '../value-objects/approval-workflow-id.vo';
import { ApprovalWorkflowBuilder } from '../builders/approval-workflow.builder';
import { DocumentTypeEntity } from './document-type.entity';

export class ApprovalWorkflowEntity extends Entity<ApprovalWorkflowId> {
  private readonly _name: string;
  private readonly _documentTypeId: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _document_type: DocumentTypeEntity;

  private constructor(builder: ApprovalWorkflowBuilder) {
    super();
    this.setId(builder.approvalWorkflowId);
    this._name = builder.name;
    this._documentTypeId = builder.documentTypeId;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._document_type = builder.document_type;
  }

  get name(): string {
    return this._name;
  }

  get documentTypeId(): number {
    return this._documentTypeId;
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

  get documentType(): DocumentTypeEntity {
    return this._document_type;
  }

  public static builder(): ApprovalWorkflowBuilder {
    return new ApprovalWorkflowBuilder();
  }

  static create(builder: ApprovalWorkflowBuilder): ApprovalWorkflowEntity {
    return new ApprovalWorkflowEntity(builder);
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

  async initializeUpdateSetId(approvalWorkflowId: ApprovalWorkflowId) {
    this.setId(approvalWorkflowId);
  }
}
