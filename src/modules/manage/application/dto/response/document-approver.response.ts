import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';
import { DepartmentResponse } from './department.response';

export class DocumentApproverResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user_approval_step_id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  user: UserResponse | null;

  @ApiProperty()
  department: DepartmentResponse | null;
}
