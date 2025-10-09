import { ApiProperty } from '@nestjs/swagger';
import { ProvinceResponse } from './province.response';

export class BudgetItemDetailResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  budget_item_id: number;

  @ApiProperty()
  province_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  allocated_amount: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  province: ProvinceResponse | null;
}
