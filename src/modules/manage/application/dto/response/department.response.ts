import { ApiProperty } from '@nestjs/swagger';
// import { DateFormat } from '@src/common/domain/value-objects/date-format.vo';
// import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
// import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
// import moment from 'moment-timezone';

export class DepartmentResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
