import { ApiProperty } from '@nestjs/swagger';
import { StatusEnum } from '@src/common/enums/status.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ApproveDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(StatusEnum, { message: i18nValidationMessage('validation.IS_ENUM') })
  readonly status: StatusEnum;
}
