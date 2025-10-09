import { ApiProperty } from '@nestjs/swagger';
import { UnitResponse } from '@src/modules/manage/application/dto/response/unit.response';

export class ReportPurchaseRequestItemResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  purchase_request_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  file_name: string;

  @ApiProperty()
  file_name_url: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  unit_id: number;

  @ApiProperty()
  price: number;

  @ApiProperty()
  total_price: number;

  @ApiProperty()
  remark: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  unit: UnitResponse | null;
}
