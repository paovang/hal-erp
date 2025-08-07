import { ApiProperty } from '@nestjs/swagger';

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
}
