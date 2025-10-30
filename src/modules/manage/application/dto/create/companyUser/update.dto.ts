import { OmitType } from '@nestjs/swagger';
import { CreateCompanyUserDto } from './create.dto';

export class UpdateCompanyUserDto extends OmitType(CreateCompanyUserDto, [
  'password',
  'confirm_password',
] as const) {}
