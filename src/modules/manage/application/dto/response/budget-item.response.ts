import { ApiProperty } from '@nestjs/swagger';
import { BudgetAccountResponse } from './budget-account.response';

export class BudgetItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  budget_account_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  allocated_amount: number;

  @ApiProperty()
  description: string | null;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  budget_account: BudgetAccountResponse | null;
}
