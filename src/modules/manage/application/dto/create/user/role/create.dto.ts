import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateRoleDto {
  @ApiProperty()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsOptional()
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly department_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly role_id: number;

  // @ApiProperty()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  // @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  // readonly name: string;

  @ApiProperty({ type: [Number] })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @IsNumber(
    {},
    { each: true, message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  readonly permissions: number[];
}
