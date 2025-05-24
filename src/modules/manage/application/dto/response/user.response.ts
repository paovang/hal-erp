import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  tel: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
