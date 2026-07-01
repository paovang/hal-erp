import { ApiProperty } from '@nestjs/swagger';

export class CompanyVendorResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  company_id: number;

  @ApiProperty()
  vendor_id: number;

  @ApiProperty({ required: false })
  company?: {
    id: number;
    name: string;
  };

  @ApiProperty({ required: false })
  vendor?: {
    id: number;
    name: string;
  };

  @ApiProperty({ enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @ApiProperty()
  credit_term_days: number;

  @ApiProperty()
  credit_limit: number;

  @ApiProperty({ required: false, nullable: true })
  payment_term: string | null;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
