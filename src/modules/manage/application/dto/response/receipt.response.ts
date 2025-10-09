import { ApiProperty } from '@nestjs/swagger';
import { ReceiptItemResponse } from './receipt-item.response';
import { DocumentResponse } from './document.response';
import { UserApprovalResponse } from './user-approval.response';
import { CurrencyTotal } from '../../commands/receipt/interface/receipt.interface';
import { DocumentAttachmentResponse } from './document-attachment.response';

export class ReceiptResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  receipt_number: string;

  @ApiProperty()
  purchase_order_id: number;

  @ApiProperty()
  po_number: string;

  @ApiProperty()
  po_doc_type: string;

  @ApiProperty()
  purchase_request_id: number;

  @ApiProperty()
  pr_number: string;

  @ApiProperty()
  pr_doc_type: string;

  @ApiProperty()
  document_id: number;

  @ApiProperty()
  receipt_date: string;

  @ApiProperty()
  received_by: number;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  account_code: string | null;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  step: boolean;

  @ApiProperty()
  step_number: number;

  @ApiProperty()
  sub_total: number | 0;

  @ApiProperty()
  vat: number | 0;

  @ApiProperty()
  total: number | 0;

  @ApiProperty()
  currency_totals: CurrencyTotal[] | null;

  @ApiProperty()
  receipt_item: ReceiptItemResponse[] | null;

  @ApiProperty()
  document: DocumentResponse | null;

  @ApiProperty()
  document_attachment: DocumentAttachmentResponse[] | null;

  @ApiProperty()
  user_approval: UserApprovalResponse | null;
}
