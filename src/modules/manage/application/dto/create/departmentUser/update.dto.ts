import { OmitType } from '@nestjs/swagger';
import { CreateDepartmentUserDto } from './create.dto';

export class UpdateDepartmentUserDto extends OmitType(CreateDepartmentUserDto, [
  'password',
] as const) {}
