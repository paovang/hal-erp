import { Entity } from '@src/common/domain/entities/entity';
import { PurchaseRequestId } from '../value-objects/purchase-request-id.vo';
import { PurchaseRequestBuilder } from '../builders/purchase-request.builder';
import { BadRequestException } from '@nestjs/common';
import { PurchaseRequestItemEntity } from './purchase-request-item.entity';
import { DocumentEntity } from './document.entity';
import { UserApprovalEntity } from './user-approval.entity';

export class PurchaseRequestEntity extends Entity<PurchaseRequestId> {
  private readonly _document_id: number;
  private readonly _pr_number: string;
  private readonly _requested_date: Date;
  private readonly _expired_date: Date;
  private readonly _purposes: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _total: number | 0;
  private readonly _purchaseRequestItems: PurchaseRequestItemEntity[] | null;
  private readonly _document: DocumentEntity | null;
  private readonly _user_approval: UserApprovalEntity | null;
  private _workflow_step_total: number | 0;
  private _step: number | 0;

  private constructor(builder: PurchaseRequestBuilder) {
    super();
    this.setId(builder.purchaseRequestId);
    this._document_id = builder.document_id;
    this._pr_number = builder.pr_number;
    this._requested_date = builder.requested_date;
    this._expired_date = builder.expired_date;
    this._purposes = builder.purposes;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._total = builder.total;
    this._purchaseRequestItems = builder.purchaseRequestItem ?? null;
    this._document = builder.document ?? null;
    this._user_approval = builder.user_approval ?? null;
    this._workflow_step_total = builder.workflow_step_total;
    this._step = builder.step;
  }

  get document_id(): number {
    return this._document_id;
  }

  get pr_number(): string {
    return this._pr_number;
  }

  get requested_date(): Date {
    return this._requested_date;
  }

  get expired_date(): Date {
    return this._expired_date;
  }

  get purposes(): string {
    return this._purposes;
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

  get total(): number | 0 {
    return this._total;
  }

  get document(): DocumentEntity | null {
    return this._document;
  }

  get step(): number | 0 {
    return this._step;
  }

  get user_approval(): UserApprovalEntity | null {
    return this._user_approval;
  }

  get workflow_step_total(): number | 0 {
    return this._workflow_step_total;
  }

  get purchaseRequestItems(): PurchaseRequestItemEntity[] | null {
    return this._purchaseRequestItems;
  }

  public static builder(): PurchaseRequestBuilder {
    return new PurchaseRequestBuilder();
  }

  static create(builder: PurchaseRequestBuilder): PurchaseRequestEntity {
    return new PurchaseRequestEntity(builder);
  }

  static getEntityName() {
    return 'PurchaseRequest';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(purchaseRequestID: PurchaseRequestId) {
    this.setId(purchaseRequestID);
  }
}
