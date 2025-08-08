import { ApiProperty } from '@nestjs/swagger';
import { BudgetItemResponse } from './budget-item.response';

export class IncreaseBudgetDetailResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  increase_budget_id: number;

  @ApiProperty()
  budget_item_id: number;

  @ApiProperty()
  allocated_amount: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  budget_item: BudgetItemResponse | null;
}
