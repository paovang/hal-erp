import { ApiProperty } from '@nestjs/swagger';
import { CurrencyResponse } from './currency.response';

export class ExchangeRateResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  from_currency_id: number;
  @ApiProperty()
  to_currency_id: number;

  @ApiProperty()
  rate: number;
  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  from_currency: CurrencyResponse | null;
  @ApiProperty()
  to_currency: CurrencyResponse | null;
}
