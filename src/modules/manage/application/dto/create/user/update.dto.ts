import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create.dto';
import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateUserDto extends OmitType(CreateUserDto, [
  'password',
  'permissionIds',
] as const) {
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsOptional()
  @IsNumber(
    {},
    { each: true, message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  permissionIds: number[];
}
