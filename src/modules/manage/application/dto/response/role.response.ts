import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponse } from './permission.response';

export class RoleResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  guard_name: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  department_id: number;

  @ApiProperty()
  department_code: string;

  @ApiProperty()
  department_name: string;

  @ApiProperty()
  permissions: PermissionResponse[];
}
