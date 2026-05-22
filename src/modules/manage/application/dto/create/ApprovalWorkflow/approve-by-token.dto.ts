import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ApproveByTokenDto {
  @ApiProperty()
  @IsDefined({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly token: string;

  @ApiProperty({ example: 1 })
  @IsDefined({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @Type(() => Number)
  @IsInt({ message: i18nValidationMessage('validation.IS_NUMBER') })
  @IsPositive({ message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly approval_workflow_id: number;
}
