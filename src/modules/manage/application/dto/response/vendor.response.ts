import { ApiProperty } from '@nestjs/swagger';

export class VendorResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  contact_info: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
