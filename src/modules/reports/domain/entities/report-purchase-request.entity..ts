import { Entity } from '@src/common/domain/entities/entity';
// import { PurchaseRequestBuilder } from '../builders/purchase-request.builder';
import { BadRequestException } from '@nestjs/common';
// import { PurchaseRequestItemEntity } from './purchase-request-item.entity';
// import { DocumentEntity } from './document.entity';
// import { UserApprovalEntity } from './user-approval.entity';
import { ReportPurchaseRequestId } from '../value-objects/report-purchase-request-id.vo';
import { ReportPurchaseRequestBuilder } from '../builders/report-purchase-request.builder';
import { ReportPurchaseRequestItemEntity } from './report-purchase-request-item.entity';
import { DocumentEntity } from '@src/modules/manage/domain/entities/document.entity';
import { UserApprovalEntity } from '@src/modules/manage/domain/entities/user-approval.entity';

export class ReportPurchaseRequestEntity extends Entity<ReportPurchaseRequestId> {
  private readonly _document_id: number;
  private readonly _pr_number: string;
  private readonly _requested_date: Date;
  private readonly _expired_date: Date;
  private readonly _purposes: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _total: number | 0;
  private readonly _purchaseRequestItems:
    | ReportPurchaseRequestItemEntity[]
    | null;
  private readonly _document: DocumentEntity | null;
  private readonly _user_approval: UserApprovalEntity | null;
  private _workflow_step_total: number | 0;
  private _step: number | 0;
  private readonly _itemCount: number | 0;

  private constructor(builder: ReportPurchaseRequestBuilder) {
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
    this._itemCount = builder.itemCount;
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

  get itemCount(): number | 0 {
    return this._itemCount;
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

  get purchaseRequestItems(): ReportPurchaseRequestItemEntity[] | null {
    return this._purchaseRequestItems;
  }

  public static builder(): ReportPurchaseRequestBuilder {
    return new ReportPurchaseRequestBuilder();
  }

  static create(
    builder: ReportPurchaseRequestBuilder,
  ): ReportPurchaseRequestEntity {
    return new ReportPurchaseRequestEntity(builder);
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

  async initializeUpdateSetId(purchaseRequestID: ReportPurchaseRequestId) {
    this.setId(purchaseRequestID);
  }
}
