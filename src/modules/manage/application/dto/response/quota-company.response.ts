import { ApiProperty } from '@nestjs/swagger';

export class QuotaCompanyResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  qty: number;

  @ApiProperty()
  year: Date;

  @ApiProperty()
  vendor_product_id: number;
  @ApiProperty()
  vendor_product?: {
    id: number;
  };
  @ApiProperty()
  company_id: number;
  @ApiProperty({ required: false })
  company?: {
    id: number;
    name: string;
  };

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
