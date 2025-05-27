import { ApiProperty } from '@nestjs/swagger';
import { CurrencyResponse } from './currency.response';
import { VendorResponse } from './vendor.response';

export class VendorBankAccountResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vendor_id: number;

  @ApiProperty()
  currency_id: number;

  @ApiProperty()
  bank_name: string;

  @ApiProperty()
  account_name: string;

  @ApiProperty()
  account_number: string;

  @ApiProperty()
  is_selected: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  vendor: VendorResponse | null;

  @ApiProperty()
  currency: CurrencyResponse | null;
}
