import { ApiProperty } from '@nestjs/swagger';
import { PurchaseOrderItemResponse } from './purchase-order-item.response';
import { PurchaseRequestResponse } from './purchase-request.response';
import { DocumentResponse } from './document.response';
import { UserApprovalResponse } from './user-approval.response';

export class PurchaseOrderResponse {
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
  purchase_order_item: PurchaseOrderItemResponse[] | null;

  // @ApiProperty()
  // selected_vendor: PurchaseOrderSelectedVendorResponse[] | null;
}
