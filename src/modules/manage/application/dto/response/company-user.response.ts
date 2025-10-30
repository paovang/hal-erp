import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';
import { CompanyResponse } from './company.response';

export class CompanyUserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  company_id: number;

  @ApiProperty()
  user_id: number;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  user: UserResponse | null;

  @ApiProperty()
  company: CompanyResponse | null;
}
