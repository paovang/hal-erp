import { Entity } from '@src/common/domain/entities/entity';
import { ApprovalWorkflowId } from '../value-objects/approval-workflow-id.vo';
import { ApprovalWorkflowBuilder } from '../builders/approval-workflow.builder';
import { DocumentTypeEntity } from './document-type.entity';
import { ApprovalWorkflowStepEntity } from './approval-workflow-step.entity';
import { StatusEnum } from '@src/common/enums/status.enum';
import { CompanyEntity } from './company.entity';

export class ApprovalWorkflowEntity extends Entity<ApprovalWorkflowId> {
  private readonly _name: string;
  private readonly _documentTypeId: number;
  private readonly _status: StatusEnum;
  private readonly _company_id: number;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _document_type: DocumentTypeEntity;
  private readonly _steps: ApprovalWorkflowStepEntity[] | null;
  private readonly _company: CompanyEntity | null;

  private constructor(builder: ApprovalWorkflowBuilder) {
    super();
    this.setId(builder.approvalWorkflowId);
    this._name = builder.name;
    this._documentTypeId = builder.documentTypeId;
    this._status = builder.status;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._document_type = builder.document_type;
    this._company_id = builder.company_id;
    this._steps = builder.steps ?? null;
    this._company = builder.company ?? null;
  }

  get name(): string {
    return this._name;
  }

  get documentTypeId(): number {
    return this._documentTypeId;
  }

  get status(): StatusEnum {
    return this._status;
  }

  get company_id(): number {
    return this._company_id;
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

  get company(): CompanyEntity | null {
    return this._company;
  }

  get steps(): ApprovalWorkflowStepEntity[] | null {
    return this._steps;
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
