import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponse } from './department.response';

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
  department_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  department: DepartmentResponse | null;
}
