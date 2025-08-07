import { ApiProperty } from '@nestjs/swagger';

export class IncreaseBudgetDetailResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  budget_item_id: number;

  @ApiProperty()
  allocated_amount: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
