import { ApiProperty } from '@nestjs/swagger';
import { BudgetAccountResponse } from './budget-account.response';
import { IncreaseBudgetFileResponse } from './increase-budget-file.response';
import { UserResponse } from './user.response';

export class IncreaseBudgetResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  budget_account_id: number;

  @ApiProperty()
  allocated_amount: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  created_by: number;

  @ApiProperty()
  import_date: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  budget_account: BudgetAccountResponse | null;

  @ApiProperty()
  created_by_user: UserResponse | null;

  @ApiProperty()
  increase_budget_files: IncreaseBudgetFileResponse[] | null;
}
