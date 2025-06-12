import { ApiProperty } from '@nestjs/swagger';

export class UserSignatureResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  signature: string;

  @ApiProperty()
  signature_url: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
