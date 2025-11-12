import { OmitType } from '@nestjs/swagger';
import { CreateRoleDto } from './create.dto';

export class UpdateRoleDto extends OmitType(CreateRoleDto, [
  'role_id',
] as const) {}
