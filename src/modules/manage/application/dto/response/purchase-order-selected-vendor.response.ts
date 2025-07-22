import { ApiProperty } from '@nestjs/swagger';
import { VendorResponse } from './vendor.response';
import { VendorBankAccountResponse } from './vendor-bank-account.response';

export class PurchaseOrderSelectedVendorResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  purchase_order_item_id: number;

  @ApiProperty()
  vendor_id: number;

  @ApiProperty()
  vendor_bank_account_id: number;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  filename_url: string;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  selected: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  vendor: VendorResponse;

  @ApiProperty()
  vendor_bank_account: VendorBankAccountResponse | null;
}
