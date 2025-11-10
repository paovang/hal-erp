import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponse } from './department.response';
import { UserResponse } from './user.response';

export class DepartmentApproverResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  department_id: number | null;

  @ApiProperty()
  company_id: number | null;

  @ApiProperty()
  user_id: number | null;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  department: DepartmentResponse | null;

  @ApiProperty()
  user: UserResponse | null;
}
