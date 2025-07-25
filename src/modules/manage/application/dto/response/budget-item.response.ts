import { ApiProperty } from '@nestjs/swagger';
import { BudgetItemDetailResponse } from './budget-item-detail.response';
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
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  count_details: number | null;

  @ApiProperty()
  budget_account: BudgetAccountResponse | null;

  @ApiProperty()
  budget_item_details: BudgetItemDetailResponse[] | null;
}
