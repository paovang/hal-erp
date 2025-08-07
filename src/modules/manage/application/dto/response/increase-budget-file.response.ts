import { ApiProperty } from '@nestjs/swagger';

export class IncreaseBudgetFileResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  file_name: string;

  @ApiProperty()
  file_name_url: string;

  @ApiProperty()
  Increase_budget_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
