import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponse } from './department.response';
import { EnumWorkflowStep } from '../../constants/status-key.const';
import { UserResponse } from './user.response';

export class ApprovalWorkflowStepResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  approval_workflow_id: number;

  @ApiProperty()
  step_name: string;

  @ApiProperty()
  step_number: number;

  @ApiProperty()
  department_id: number | null;

  @ApiProperty()
  user_id: number | null;

  @ApiProperty()
  type: EnumWorkflowStep;

  @ApiProperty()
  requires_file: boolean;

  @ApiProperty()
  is_otp: boolean;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  department: DepartmentResponse | null;

  @ApiProperty()
  user: UserResponse | null;
}
