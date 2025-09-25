import { ApiProperty } from '@nestjs/swagger';
import { EnumPrOrPo } from '../../constants/status-key.const';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CountItemDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(EnumPrOrPo, { message: i18nValidationMessage('validation.IS_ENUM') })
  readonly type: EnumPrOrPo;
}
