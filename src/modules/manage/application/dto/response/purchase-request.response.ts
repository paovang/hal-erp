import { ApiProperty } from '@nestjs/swagger';

export class PurchaseRequestResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
