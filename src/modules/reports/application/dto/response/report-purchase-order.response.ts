import { ApiProperty } from '@nestjs/swagger';
import { DocumentResponse } from '@src/modules/manage/application/dto/response/document.response';
import { PurchaseRequestResponse } from '@src/modules/manage/application/dto/response/purchase-request.response';
import { UserApprovalResponse } from '@src/modules/manage/application/dto/response/user-approval.response';
import { ReportPurchaseOrderItemResponse } from './report-purchase-order-item.response';

export class ReportPurchaseOrderResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  purchase_request_id: number;

  @ApiProperty()
  po_number: string;

  @ApiProperty()
  order_date: string;

  @ApiProperty()
  expired_date: string;

  @ApiProperty()
  purposes: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  itemCount: number | 0;

  @ApiProperty()
  sub_total: number | 0;

  @ApiProperty()
  vat: number | 0;

  @ApiProperty()
  total: number | 0;

  @ApiProperty()
  step: boolean;

  @ApiProperty()
  purchase_request: PurchaseRequestResponse | null;

  @ApiProperty()
  document: DocumentResponse | null;

  @ApiProperty()
  user_approval: UserApprovalResponse | null;

  @ApiProperty()
  purchase_order_item: ReportPurchaseOrderItemResponse[] | null;

  // @ApiProperty()
  // selected_vendor: PurchaseOrderSelectedVendorResponse[] | null;
}
