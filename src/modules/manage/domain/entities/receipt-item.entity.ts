import { Entity } from '@src/common/domain/entities/entity';
import { BadRequestException } from '@nestjs/common';
import { ReceiptItemId } from '../value-objects/receipt-item-id.vo';
import { EnumPaymentType } from '../../application/constants/status-key.const';
import { ReceiptItemBuilder } from '../builders/receipt-item.builder';
import { CurrencyEntity } from './currency.entity';

export class ReceiptItemEntity extends Entity<ReceiptItemId> {
  private readonly _receipt_id: number;
  private readonly _purchase_order_item_id: number;
  private readonly _quantity: number;
  private readonly _price: number;
  private readonly _total: number;
  private readonly _currency_id: number;
  private readonly _exchange_rate: number;
  private readonly _payment_currency_id: number;
  private readonly _payment_total: number;
  private readonly _payment_type: EnumPaymentType;
  private readonly _remark: string;
  private readonly _createdAt: Date;
  private readonly _updatedAt: Date | null;
  private readonly _deletedAt: Date | null;
  private readonly _currency: CurrencyEntity | null;
  private readonly _payment_currency: CurrencyEntity | null;

  private constructor(builder: ReceiptItemBuilder) {
    super();
    this.setId(builder.receiptItemId);
    this._receipt_id = builder.receipt_id;
    this._purchase_order_item_id = builder.purchase_order_item_id;
    this._quantity = builder.quantity;
    this._price = builder.price;
    this._total = builder.total;
    this._currency_id = builder.currency_id;
    this._payment_currency_id = builder.payment_currency_id;
    this._exchange_rate = builder.exchange_rate;
    this._payment_total = builder.payment_total;
    this._payment_type = builder.payment_type;
    this._remark = builder.remark;
    this._createdAt = builder.createdAt;
    this._updatedAt = builder.updatedAt ?? null;
    this._deletedAt = builder.deletedAt ?? null;
    this._currency = builder.currency ?? null;
    this._payment_currency = builder.payment_currency ?? null;
  }

  get receipt_id(): number {
    return this._receipt_id;
  }

  get purchase_order_item_id(): number {
    return this._purchase_order_item_id;
  }

  get quantity(): number {
    return this._quantity;
  }

  get price(): number {
    return this._price;
  }

  get total(): number {
    return this._total;
  }

  get currency_id(): number {
    return this._currency_id;
  }

  get exchange_rate(): number {
    return this._exchange_rate;
  }

  get payment_currency_id(): number {
    return this._payment_currency_id;
  }

  get payment_total(): number {
    return this._payment_total;
  }

  get payment_type(): EnumPaymentType {
    return this._payment_type;
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

  get currency(): CurrencyEntity | null {
    return this._currency;
  }

  get payment_currency(): CurrencyEntity | null {
    return this._payment_currency;
  }

  public static builder(): ReceiptItemBuilder {
    return new ReceiptItemBuilder();
  }

  static create(builder: ReceiptItemBuilder): ReceiptItemEntity {
    return new ReceiptItemEntity(builder);
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

  async initializeUpdateSetId(receiptItemID: ReceiptItemId) {
    this.setId(receiptItemID);
  }
}
