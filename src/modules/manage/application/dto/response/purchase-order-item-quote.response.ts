import { ApiProperty } from '@nestjs/swagger';
import { VendorResponse } from './vendor.response';
import { VendorBankAccountResponse } from './vendor-bank-account.response';

export class PurchaseOrderItemQuoteResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  purchase_order_item_id: number;

  @ApiProperty()
  vendor_id: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  is_selected: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  vendor: VendorResponse | null;

  @ApiProperty()
  vendor_bank_account: VendorBankAccountResponse[] | null;
}
