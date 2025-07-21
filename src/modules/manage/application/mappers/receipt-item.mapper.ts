import { Injectable } from '@nestjs/common';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
import moment from 'moment-timezone';
import { ReceiptItemEntity } from '../../domain/entities/receipt-item.entity';
import { ReceiptItemResponse } from '../dto/response/receipt-item.response';
import { EnumPaymentType } from '../constants/status-key.const';
import { CurrencyDataMapper } from './currency.mapper';

interface ReceiptItemInterface {
  receipt_id: number;
  purchase_order_item_id?: number;
  quantity?: number;
  price?: number;
  total?: number;
  currency_id?: number;
  payment_currency_id: number;
  exchange_rate: number;
  payment_total: number;
  payment_type: EnumPaymentType;
  remark: string;
}

@Injectable()
export class ReceiptItemDataMapper {
  constructor(
    private readonly _currency: CurrencyDataMapper,
    private readonly _payment_currency: CurrencyDataMapper,
  ) {}
  /** Mapper Dto To Entity */
  toEntity(dto: ReceiptItemInterface): ReceiptItemEntity {
    const builder = ReceiptItemEntity.builder();

    if (dto.receipt_id) {
      builder.setReceiptId(dto.receipt_id);
    }

    if (dto.purchase_order_item_id) {
      builder.setPurchaseOrderId(dto.purchase_order_item_id);
    }

    if (dto.quantity) {
      builder.setQuantity(dto.quantity);
    }

    if (dto.price) {
      builder.setPrice(dto.price);
    }

    if (dto.total) {
      builder.setTotal(dto.total);
    }

    if (dto.currency_id) {
      builder.setCurrencyId(dto.currency_id);
    }

    if (dto.payment_currency_id) {
      builder.setPaymentCurrencyId(dto.payment_currency_id);
    }

    if (dto.exchange_rate) {
      builder.setExchangeRate(dto.exchange_rate);
    }

    if (dto.payment_total) {
      builder.setPaymentTotal(dto.payment_total);
    }

    if (dto.payment_type) {
      builder.setPaymentType(dto.payment_type);
    }

    if (dto.remark) {
      builder.setRemark(dto.remark);
    }

    return builder.build();
  }

  /** Mapper Entity To Response */
  toResponse(entity: ReceiptItemEntity): ReceiptItemResponse {
    const response = new ReceiptItemResponse();
    response.id = Number(entity.getId().value);
    response.receipt_id = Number(entity.receipt_id);
    response.purchase_order_item_id = Number(entity.purchase_order_item_id);
    response.quantity = entity.quantity;
    response.price = entity.price;
    response.total = entity.total;
    response.currency_id = Number(entity.currency_id);
    response.payment_currency_id = Number(entity.payment_currency_id);
    response.exchange_rate = entity.exchange_rate;
    response.payment_total = entity.payment_total;
    response.payment_type = entity.payment_type;
    response.remark = entity.remark;
    response.created_at = moment
      .tz(entity.createdAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);
    response.updated_at = moment
      .tz(entity.updatedAt, Timezone.LAOS)
      .format(DateFormat.DATETIME_READABLE_FORMAT);

    response.currency = entity.currency
      ? this._currency.toResponse(entity.currency)
      : null;
    response.payment_currency = entity.payment_currency
      ? this._payment_currency.toResponse(entity.payment_currency)
      : null;

    return response;
  }
}
