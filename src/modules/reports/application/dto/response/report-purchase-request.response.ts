import { ApiProperty } from '@nestjs/swagger';
import { ReportPurchaseRequestItemResponse } from './report-purchase-request-item.response';
import { DocumentResponse } from '@src/modules/manage/application/dto/response/document.response';
import { UserApprovalResponse } from '@src/modules/manage/application/dto/response/user-approval.response';

export class ReportPurchaseRequestResponse {
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
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  itemCount: number | 0;

  @ApiProperty()
  total: number | 0;

  @ApiProperty()
  step: boolean;

  @ApiProperty()
  document: DocumentResponse | null;

  @ApiProperty()
  user_approval: UserApprovalResponse | null;

  @ApiProperty()
  purchase_request_item: ReportPurchaseRequestItemResponse[] | null;
}
