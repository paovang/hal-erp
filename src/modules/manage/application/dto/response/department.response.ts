import { ApiProperty } from '@nestjs/swagger';
import { UserResponse } from './user.response';
import { CompanyResponse } from './company.response';
// import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
// import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
// import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
// import moment from 'moment-timezone';

export class DepartmentResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  is_line_manager: boolean;

  @ApiProperty()
  department_head_id: number;

  @ApiProperty()
  type: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  deleted_at: string | null;

  @ApiProperty()
  department_head: UserResponse | null;

  @ApiProperty()
  company: CompanyResponse | null;
}
