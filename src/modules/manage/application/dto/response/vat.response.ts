import { ApiProperty } from '@nestjs/swagger';

export class VatResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
