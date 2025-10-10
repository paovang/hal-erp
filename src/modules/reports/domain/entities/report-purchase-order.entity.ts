import { Entity } from '@src/common/domain/entities/entity';
import { ReportPurchaseOrderId } from '../value-objects/report-purchase-order-id.vo';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { PurchaseOrderItemEntity } from '@src/modules/manage/domain/entities/purchase-order-item.entity';
import { DocumentEntity } from '@src/modules/manage/domain/entities/document.entity';
import { ReportPurchaseOrderBuilder } from '../builders/report-purchase-order.builder';
import { BadRequestException } from '@nestjs/common';
import { UserApprovalEntity } from '@src/modules/manage/domain/entities/user-approval.entity';

export class ReportPurchaseOrderEntity extends Entity<ReportPurchaseOrderId> {
  private readonly _purchase_request_id: number;
  private readonly _document_id: number;
  private readonly _po_number: string;
  private readonly _order_date: Date | null;
  private readonly _expired_date: Date | null;
  private readonly _purposes: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _sub_total: number | 0;
  private readonly _vat: number | 0;
  private readonly _total: number | 0;
  private readonly _purchaseRequest: PurchaseRequestEntity | null;
  private readonly _orderItem: PurchaseOrderItemEntity[] | null;
  // private readonly _selectedVendor: PurchaseOrderSelectedVendorEntity[] | null;
  private readonly _document: DocumentEntity | null;
  private readonly _user_approval: UserApprovalEntity | null;
  private _step: number | 0;

  private constructor(builder: ReportPurchaseOrderBuilder) {
    super();
    this.setId(builder.purchaseOrderId);
    this._purchase_request_id = builder.purchase_request_id;
    this._document_id = builder.document_id;
    this._po_number = builder.po_number;
    this._order_date = builder.order_date;
    this._expired_date = builder.expired_date;
    this._purposes = builder.purposes;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._sub_total = builder.sub_total ?? 0;
    this._vat = builder.vat ?? 0;
    this._total = builder.total;
    this._purchaseRequest = builder.purchaseRequest ?? null;
    this._orderItem = builder.orderItem ?? null;
    // this._selectedVendor = builder.selectedVendor ?? null;
    this._document = builder.document ?? null;
    this._user_approval = builder.user_approval ?? null;
    this._step = builder.step;
  }

  get purchase_request_id(): number {
    return this._purchase_request_id;
  }

  get document_id(): number {
    return this._document_id;
  }

  get po_number(): string {
    return this._po_number;
  }

  get order_date(): Date | null {
    return this._order_date;
  }

  get expired_date(): Date | null {
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

  get sub_total(): number | 0 {
    return this._sub_total;
  }

  get vat(): number | 0 {
    return this._vat;
  }

  get total(): number | 0 {
    return this._total;
  }

  get step(): number | 0 {
    return this._step;
  }

  get purchaseRequest(): PurchaseRequestEntity | null {
    return this._purchaseRequest;
  }

  get orderItem(): PurchaseOrderItemEntity[] | null {
    return this._orderItem;
  }

  // get selectedVendor(): PurchaseOrderSelectedVendorEntity[] | null {
  //   return this._selectedVendor;
  // }

  get document(): DocumentEntity | null {
    return this._document;
  }

  get user_approval(): UserApprovalEntity | null {
    return this._user_approval;
  }

  public static builder(): ReportPurchaseOrderBuilder {
    return new ReportPurchaseOrderBuilder();
  }

  static create(
    builder: ReportPurchaseOrderBuilder,
  ): ReportPurchaseOrderEntity {
    return new ReportPurchaseOrderEntity(builder);
  }

  static getEntityName() {
    return 'purchase_order';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(reportPurchaseOrderID: ReportPurchaseOrderId) {
    this.setId(reportPurchaseOrderID);
  }
}
