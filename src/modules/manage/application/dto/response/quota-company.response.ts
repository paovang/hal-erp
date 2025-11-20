import { ApiProperty } from '@nestjs/swagger';
import { ProductResponse } from './product.response';
import { VendorProductResponse } from './vendor-product.response';
import { VendorResponse } from './vendor.response';

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

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  vendor_product: VendorProductResponse | null;

  @ApiProperty()
  Product: ProductResponse | null;

  @ApiProperty()
  vendor: VendorResponse | null;
}
