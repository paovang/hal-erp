import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrderItemQuoteResponse } from './purchase-order-item-quote.response';
import { BudgetItemDetailResponse } from './budget-item-detail.response';

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
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  budget_item_detail: BudgetItemDetailResponse | null;

  @ApiProperty()
  order_item_quote: PurchaseOrderItemQuoteResponse[] | null;
}
