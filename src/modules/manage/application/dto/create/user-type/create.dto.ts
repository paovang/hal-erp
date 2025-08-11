import { ApiProperty } from '@nestjs/swagger';
import { UserTypeEnum } from '@src/common/constants/user-type.enum';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserTypeDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  // @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsEnum(UserTypeEnum, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly name: UserTypeEnum;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly user_id: number;
}
