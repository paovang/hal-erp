import { ApiProperty } from '@nestjs/swagger';
import { CompanyResponse } from './company.response';

export class PositionResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  company_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  company: CompanyResponse | null;
}
