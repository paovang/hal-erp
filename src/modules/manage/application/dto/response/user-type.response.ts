import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';

export class UserTypeResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  user: UserResponse | null;
}
