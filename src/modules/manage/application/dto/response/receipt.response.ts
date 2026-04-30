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
  itemCount: number;

  @ApiProperty({
    description:
      'Sum of receipt-item payment_total across all items, converted to LAK using each item payment currency exchange rate.',
  })
  sub_total: number | 0;

  @ApiProperty({
    description:
      'Sum of receipt-item VAT across all items, converted to LAK using each item payment currency exchange rate.',
  })
  vat: number | 0;

  @ApiProperty({
    description:
      'sub_total + vat in LAK. Always denominated in LAK regardless of payment currency on the items.',
  })
  total: number | 0;

  @ApiProperty({
    description:
      'Per-payment-currency breakdown. id/code/name identify the original payment currency; total/vat/amount are in LAK after exchange-rate conversion.',
    type: () => Object,
    isArray: true,
  })
  currency_totals: CurrencyTotal[] | null;

  @ApiProperty()
  receipt_item: ReceiptItemResponse[] | null;

  @ApiProperty()
  document: DocumentResponse | null;

  @ApiProperty()
  document_attachment: DocumentAttachmentResponse[] | null;

  @ApiProperty()
  user_approval: UserApprovalResponse | null;

  @ApiProperty()
  user_last_approval: string | null;
}
