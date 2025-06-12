import { ApiProperty } from '@nestjs/swagger';
import { RoleResponse } from './role.response';
import { PermissionResponse } from './permission.response';
import { UserSignatureResponse } from './user-signature.response';

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
  deleted_at: string | null;

  @ApiProperty()
  user_signature: UserSignatureResponse | null;

  @ApiProperty()
  roles: RoleResponse[];

  @ApiProperty()
  permissions: PermissionResponse[] | null;
}
