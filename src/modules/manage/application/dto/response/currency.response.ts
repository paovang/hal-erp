import { ApiProperty } from '@nestjs/swagger';

export class CurrencyResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
