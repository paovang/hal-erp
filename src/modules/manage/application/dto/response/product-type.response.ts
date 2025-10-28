import { ApiProperty } from '@nestjs/swagger';

export class ProductTypeResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category_id: number;

  @ApiProperty({ required: false })
  category?: {
    id: number;
    name: string;
  };

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}