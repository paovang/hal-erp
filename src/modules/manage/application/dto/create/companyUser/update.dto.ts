import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateCompanyUserDto } from './create.dto';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateCompanyUserDto extends OmitType(CreateCompanyUserDto, [
  'password',
  'confirm_password',
  'signature',
  'permissionIds',
] as const) {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly signature: string;

  @ApiProperty()
  @IsOptional()
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsNumber(
    {},
    { each: true, message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  permissionIds: number[];
}
