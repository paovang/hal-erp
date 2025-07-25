import { ApiProperty } from '@nestjs/swagger';

export class BankResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  short_name: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  logo: any;

  @ApiProperty()
  logoUrl: any;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
