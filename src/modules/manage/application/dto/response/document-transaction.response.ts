import { ApiProperty } from '@nestjs/swagger';
import { EnumDocumentTransactionType } from '../../constants/status-key.const';

export class DocumentTransactionResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  transaction_number: string;

  @ApiProperty()
  document_id: number;

  @ApiProperty()
  budget_item_detail_id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  transaction_type: EnumDocumentTransactionType;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
