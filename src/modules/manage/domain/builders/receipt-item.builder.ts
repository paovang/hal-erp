import { EnumPaymentType } from '../../application/constants/status-key.const';
import { CurrencyEntity } from '../entities/currency.entity';
import { PurchaseOrderItemEntity } from '../entities/purchase-order-item.entity';
import { ReceiptItemEntity } from '../entities/receipt-item.entity';
import { ReceiptItemId } from '../value-objects/receipt-item-id.vo';

export class ReceiptItemBuilder {
  receiptItemId: ReceiptItemId;
  receipt_id: number;
  purchase_order_item_id: number;
  quantity: number;
  price: number;
  total: number;
  currency_id: number;
  exchange_rate: number;
  vat: number;
  payment_currency_id: number;
  payment_total: number;
  payment_type: EnumPaymentType;
  remark: string;
  createdAt!: Date;
  updatedAt!: Date | null;
  deletedAt!: Date | null;
  currency: CurrencyEntity | null;
  payment_currency: CurrencyEntity | null;
  purchase_order_item: PurchaseOrderItemEntity | null;

  setReceiptItemId(value: ReceiptItemId): this {
    this.receiptItemId = value;
    return this;
  }

  setReceiptId(receipt_id: number): this {
    this.receipt_id = receipt_id;
    return this;
  }

  setPurchaseOrderId(purchase_order_item_id: number): this {
    this.purchase_order_item_id = purchase_order_item_id;
    return this;
  }

  setQuantity(quantity: number): this {
    this.quantity = quantity;
    return this;
  }

  setPrice(price: number): this {
    this.price = price;
    return this;
  }

  setTotal(total: number): this {
    this.total = total;
    return this;
  }

  setCurrencyId(currency_id: number): this {
    this.currency_id = currency_id;
    return this;
  }

  setPaymentCurrencyId(payment_currency_id: number): this {
    this.payment_currency_id = payment_currency_id;
    return this;
  }

  setPaymentTotal(payment_total: number): this {
    this.payment_total = payment_total;
    return this;
  }

  setPaymentType(payment_type: EnumPaymentType): this {
    this.payment_type = payment_type;
    return this;
  }

  setRemark(remark: string): this {
    this.remark = remark;
    return this;
  }

  setExchangeRate(exchange_rate: number): this {
    this.exchange_rate = exchange_rate;
    return this;
  }

  setVat(vat: number): this {
    this.vat = vat;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date | null): this {
    this.updatedAt = updatedAt;
    return this;
  }

  setDeletedAt(deletedAt: Date | null): this {
    this.deletedAt = deletedAt;
    return this;
  }

  setCurrency(currency: CurrencyEntity | null): this {
    this.currency = currency;
    return this;
  }

  setPaymentCurrency(payment_currency: CurrencyEntity | null): this {
    this.payment_currency = payment_currency;
    return this;
  }

  setPurchaseOrderItem(
    purchase_order_item: PurchaseOrderItemEntity | null,
  ): this {
    this.purchase_order_item = purchase_order_item;
    return this;
  }

  build(): ReceiptItemEntity {
    return ReceiptItemEntity.create(this);
  }
}
