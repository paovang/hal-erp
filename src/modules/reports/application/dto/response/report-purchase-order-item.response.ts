import { ApiProperty } from '@nestjs/swagger';
import { BudgetItemResponse } from '@src/modules/manage/application/dto/response/budget-item.response';
import { PurchaseOrderSelectedVendorResponse } from '@src/modules/manage/application/dto/response/purchase-order-selected-vendor.response';
import { PurchaseRequestItemResponse } from '@src/modules/manage/application/dto/response/purchase-request-item.response';
export class ReportPurchaseOrderItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  purchase_order_id: number;

  @ApiProperty()
  purchase_request_item_id: number;

  @ApiProperty()
  budget_item_id: number;

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
  budget_item: BudgetItemResponse | null;

  @ApiProperty()
  purchase_request_item: PurchaseRequestItemResponse | null;

  @ApiProperty()
  selected_vendor: PurchaseOrderSelectedVendorResponse[] | null;
}
