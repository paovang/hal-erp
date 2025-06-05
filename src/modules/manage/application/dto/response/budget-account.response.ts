import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponse } from './department.response';

export class BudgetAccountResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  department_id: number;

  @ApiProperty()
  fiscal_year: number;

  @ApiProperty()
  allocated_amount: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  department: DepartmentResponse | null;
}
