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
  company_id: number;

  @ApiProperty()
  company_name: string;

  @ApiProperty()
  company_tel: string;

  @ApiProperty()
  company_email: string;

  @ApiProperty()
  company_logo: string;

  @ApiProperty()
  company_logo_url?: string | null;

  @ApiProperty()
  company_address: string;

  @ApiProperty()
  permissions: PermissionResponse[];
}
