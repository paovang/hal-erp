import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateCompanyUserDto } from './create.dto';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateCompanyUserDto extends OmitType(CreateCompanyUserDto, [
  'password',
  'confirm_password',
  'signature',
] as const) {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly signature: string;
}
