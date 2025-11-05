import { ApiProperty } from '@nestjs/swagger';

export class VendorProductResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  vendor_id: number;

  @ApiProperty()
  product_id: number;

  @ApiProperty({ required: false })
  vendor?: {
    id: number;
    name: string;
  };

  @ApiProperty({ required: false })
  product?: {
    id: number;
    name: string;
  };

  @ApiProperty()
  price: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}