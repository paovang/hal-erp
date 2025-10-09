import { ApiProperty } from '@nestjs/swagger';
import { CurrencyResponse } from './currency.response';
import { PurchaseOrderItemResponse } from './purchase-order-item.response';

export class ReceiptItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  receipt_id: number;

  @ApiProperty()
  purchase_order_item_id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  currency_id: number;

  @ApiProperty()
  payment_currency_id: number;

  @ApiProperty()
  exchange_rate: number;

  @ApiProperty()
  payment_total: number;

  @ApiProperty()
  vat: number;

  @ApiProperty()
  payment_type: string;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  currency: CurrencyResponse | null;

  @ApiProperty()
  payment_currency: CurrencyResponse | null;

  @ApiProperty()
  purchase_order_item: PurchaseOrderItemResponse | null;
}
