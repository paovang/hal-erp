import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsOptional, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

const TIME_REGEX = /^\d{1,2}:\d{2}(:\d{2})?$/;

export class UpdateMailPreferenceDto {
  @ApiProperty({ example: true })
  @IsDefined({ message: i18nValidationMessage('validation.IS_DEFINED') })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  is_enabled: boolean;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional()
  @Matches(TIME_REGEX, {
    message: i18nValidationMessage('validation.INVALID_TIME_FORMAT'),
  })
  start_time?: string;

  @ApiPropertyOptional({ example: '17:00' })
  @IsOptional()
  @Matches(TIME_REGEX, {
    message: i18nValidationMessage('validation.INVALID_TIME_FORMAT'),
  })
  end_time?: string;
}
