import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponse } from './department.response';
import { UserResponse } from './user.response';

export class BudgetApprovalRuleResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  department_id: number;

  @ApiProperty()
  approver_id: number;

  @ApiProperty()
  min_amount: number;

  @ApiProperty()
  max_amount: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  department: DepartmentResponse | null;

  @ApiProperty()
  approver: UserResponse | null;
}
