import { ApiProperty } from '@nestjs/swagger';
import { DepartmentResponse } from './department.response';
import { EnumBudgetType } from '../../constants/status-key.const';
import { CompanyResponse } from './company.response';

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
  company_id: number;

  @ApiProperty()
  fiscal_year: number;

  @ApiProperty()
  allocated_amount: number;

  @ApiProperty()
  increase_amount: number;

  @ApiProperty()
  total_budget: number;

  @ApiProperty()
  used_amount: number;

  @ApiProperty()
  balance_amount: number;

  @ApiProperty()
  type: EnumBudgetType;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  department: DepartmentResponse | null;

  @ApiProperty()
  company: CompanyResponse | null;
}
