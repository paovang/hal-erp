import { ApiProperty } from '@nestjs/swagger';

export class CompanyProductResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  company_id: number;

  @ApiProperty()
  product_id: number;

  @ApiProperty({ required: false })
  company?: {
    id: number;
    name: string;
  };

  @ApiProperty({ required: false })
  product?: {
    id: number;
    name: string;
  };

  @ApiProperty({ enum: ['active', 'inactive'] })
  status: 'active' | 'inactive';

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
