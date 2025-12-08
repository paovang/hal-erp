import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  logo_url: string | null;

  @ApiProperty()
  tel: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  receipt_count: number;

  @ApiProperty()
  total_allocated: number;

  @ApiProperty()
  total_used_amount: number;
}
