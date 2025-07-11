import { ApiProperty } from '@nestjs/swagger';
import { BudgetItemDetailResponse } from './budget-item-detail.response';
import { PurchaseOrderSelectedVendorResponse } from './purchase-order-selected-vendor.response';

export class PurchaseOrderItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  purchase_order_id: number;

  @ApiProperty()
  purchase_request_item_id: number;

  @ApiProperty()
  budget_item_detail_id: number;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  vat_total: number | 0;

  @ApiProperty()
  total_with_vat: number | 0;

  @ApiProperty()
  is_vat: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  budget_item_detail: BudgetItemDetailResponse | null;

  @ApiProperty()
  selected_vendor: PurchaseOrderSelectedVendorResponse[] | null;

  // @ApiProperty()
  // order_item_quote: PurchaseOrderItemQuoteResponse[] | null;
}
