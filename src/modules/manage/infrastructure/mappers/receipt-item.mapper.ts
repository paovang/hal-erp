import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ReceiptItemEntity } from '../../domain/entities/receipt-item.entity';
import { ReceiptItemOrmEntity } from '@src/common/infrastructure/database/typeorm/receipt.item.orm';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import { ReceiptItemId } from '../../domain/value-objects/receipt-item-id.vo';
import { Injectable } from '@nestjs/common';
import { CurrencyDataAccessMapper } from './currency.mapper';
import { PurchaseOrderItemDataAccessMapper } from './purchase-order-item.mapper';

@Injectable()
export class ReceiptItemDataAccessMapper {
  constructor(
    private readonly _currency: CurrencyDataAccessMapper,
    private readonly _payment_currency: CurrencyDataAccessMapper,
    private readonly _purchase_order_item: PurchaseOrderItemDataAccessMapper,
  ) {}
  toOrmEntity(
    receiptEntity: ReceiptItemEntity,
    method: OrmEntityMethod,
  ): ReceiptItemOrmEntity {
    const now = moment.tz(Timezone.LAOS).format(DateFormat.DATETIME_FORMAT);
    const id = receiptEntity.getId();

    const mediaOrmEntity = new ReceiptItemOrmEntity();
    if (id) {
      mediaOrmEntity.id = id.value;
    }
    mediaOrmEntity.receipt_id = receiptEntity.receipt_id;
    mediaOrmEntity.purchase_order_item_id =
      receiptEntity.purchase_order_item_id;
    mediaOrmEntity.quantity = receiptEntity.quantity;
    mediaOrmEntity.price = receiptEntity.price;
    mediaOrmEntity.total = receiptEntity.total;
    mediaOrmEntity.currency_id = receiptEntity.currency_id;
    mediaOrmEntity.payment_currency_id = receiptEntity.payment_currency_id;
    mediaOrmEntity.exchange_rate = receiptEntity.exchange_rate;
    mediaOrmEntity.payment_total = receiptEntity.payment_total;
    mediaOrmEntity.payment_type = receiptEntity.payment_type;
    mediaOrmEntity.remark = receiptEntity.remark;
    if (method === OrmEntityMethod.CREATE) {
      mediaOrmEntity.vat = receiptEntity.vat;
      mediaOrmEntity.created_at = receiptEntity.createdAt ?? new Date(now);
    }
    mediaOrmEntity.updated_at = new Date(now);

    return mediaOrmEntity;
  }

  toEntity(ormData: ReceiptItemOrmEntity): ReceiptItemEntity {
    const builder = ReceiptItemEntity.builder()
      .setReceiptItemId(new ReceiptItemId(ormData.id))
      .setReceiptId(ormData.receipt_id ?? 0)
      .setPurchaseOrderId(ormData.purchase_order_item_id ?? 0)
      .setQuantity(ormData.quantity ?? 0)
      .setPrice(ormData.price ?? 0)
      .setTotal(ormData.total ?? 0)
      .setCurrencyId(ormData.currency_id ?? 0)
      .setPaymentCurrencyId(ormData.payment_currency_id ?? 0)
      .setExchangeRate(ormData.exchange_rate ?? 0)
      .setVat(ormData.vat ?? 0)
      .setPaymentTotal(ormData.payment_total ?? 0)
      .setPaymentType(ormData.payment_type)
      .setRemark(ormData.remark ?? '')
      .setCreatedAt(ormData.created_at)
      .setUpdatedAt(ormData.updated_at);

    if (ormData.currency) {
      builder.setCurrency(this._currency.toEntity(ormData.currency));
    }

    if (ormData.payment_currency) {
      builder.setPaymentCurrency(
        this._payment_currency.toEntity(ormData.payment_currency),
      );
    }

    if (ormData.purchase_order_items) {
      builder.setPurchaseOrderItem(
        this._purchase_order_item.toEntity(ormData.purchase_order_items),
      );
    }

    return builder.build();
  }
}
