import { ApiProperty } from '@nestjs/swagger';
import { PurchaseRequestItemResponse } from './purchase-request-item.response';
import { DocumentResponse } from './document.response';
import { UserApprovalResponse } from './user-approval.response';
import { CompanyResponse } from './company.response';

export class PurchaseRequestResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  document_id: number;

  @ApiProperty()
  pr_number: string;

  @ApiProperty()
  requested_date: string;

  @ApiProperty()
  expired_date: string;

  @ApiProperty()
  purposes: string;

  @ApiProperty()
  is_created_po: boolean | null;

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
  document: DocumentResponse | null;

  @ApiProperty()
  company: CompanyResponse | null;

  @ApiProperty()
  user_approval: UserApprovalResponse | null;

  @ApiProperty()
  purchase_request_item: PurchaseRequestItemResponse[] | null;
}
