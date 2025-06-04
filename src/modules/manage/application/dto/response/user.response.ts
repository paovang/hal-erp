import { ApiProperty } from '@nestjs/swagger';
import { RoleResponse } from './role.response';
import { PermissionResponse } from './permission.response';

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

  @ApiProperty()
  roles: RoleResponse[];

  @ApiProperty()
  permissions: PermissionResponse[] | null;
}
