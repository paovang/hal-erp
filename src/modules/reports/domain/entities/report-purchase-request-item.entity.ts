import { Entity } from '@src/common/domain/entities/entity';
import { BadRequestException } from '@nestjs/common';
import { ReportPurchaseRequestItemId } from '../value-objects/report-purchase-request-item-id.vo';
import { ReportPurchaseRequestItemBuilder } from '../builders/report-purchase-request-item.builder';

export class ReportPurchaseRequestItemEntity extends Entity<ReportPurchaseRequestItemId> {
  private readonly _purchase_request_id: number;
  private readonly _title: string;
  private readonly _file_name: any;
  private readonly _quantity: number;
  private readonly _unit_id: number;
  private readonly _price: number;
  private readonly _total_price: number;
  private readonly _remark: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  //   private readonly _unit: UnitEntity | null;

  private constructor(builder: ReportPurchaseRequestItemBuilder) {
    super();
    this.setId(builder.purchaseRequestItemId);
    this._purchase_request_id = builder.purchase_request_id;
    this._title = builder.title;
    this._file_name = builder.file_name;
    this._quantity = builder.quantity;
    this._unit_id = builder.unit_id;
    this._price = builder.price;
    this._total_price = builder.total_price;
    this._remark = builder.remark;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    // this._unit = builder.unit ?? null;
  }

  get purchase_request_id(): number {
    return this._purchase_request_id;
  }

  get title(): string {
    return this._title;
  }

  get file_name(): any {
    return this._file_name;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unit_id(): number {
    return this._unit_id;
  }

  get price(): number {
    return this._price;
  }

  get total_price(): number {
    return this._total_price;
  }

  get remark(): string {
    return this._remark;
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

  //   get unit(): UnitEntity | null {
  //     return this._unit;
  //   }

  public static builder(): ReportPurchaseRequestItemBuilder {
    return new ReportPurchaseRequestItemBuilder();
  }

  static create(
    builder: ReportPurchaseRequestItemBuilder,
  ): ReportPurchaseRequestItemEntity {
    return new ReportPurchaseRequestItemEntity(builder);
  }

  static getEntityName() {
    return 'purchase_request_item';
  }

  async validateExistingIdForUpdate() {
    if (!this.getId()) {
      console.log('phoudvang');
      throw new BadRequestException(
        'users.user_is_not_in_correct_state_for_initialization',
      );
    }
  }

  async initializeUpdateSetId(
    purchaseRequestItemID: ReportPurchaseRequestItemId,
  ) {
    this.setId(purchaseRequestItemID);
  }
}
