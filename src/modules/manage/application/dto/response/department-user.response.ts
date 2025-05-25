import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';
import { DepartmentResponse } from './department.response';
import { PositionResponse } from './position.response';

export class DepartmentUserResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  department_id: number;

  @ApiProperty()
  position_id: number;

  @ApiProperty()
  signature_file: string | null;

  @ApiProperty()
  signature_file_url: string | null;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  department: DepartmentResponse | null;

  @ApiProperty()
  position: PositionResponse | null;

  @ApiProperty()
  user: UserResponse | null;
}
