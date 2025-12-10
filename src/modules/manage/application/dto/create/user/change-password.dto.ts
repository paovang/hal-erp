import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ChangePasswordDto {
  // @ApiProperty()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  // @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  // @Length(6, 255, {
  //   message: i18nValidationMessage('validation.PASSWORD_LENGTH'),
  // })
  // readonly old_password: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(6, 255, {
    message: i18nValidationMessage('validation.PASSWORD_LENGTH'),
  })
  new_password: string;
}
