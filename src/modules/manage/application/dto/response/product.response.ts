import { ApiProperty } from '@nestjs/swagger';

export class ProductResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  product_type_id: number;

  @ApiProperty({ required: false })
  product_type?: {
    id: number;
    name: string;
  };

  @ApiProperty()
  unit_id: number;

  @ApiProperty({ required: false })
  unit?: {
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