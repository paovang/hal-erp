import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { EnumWorkflowStep } from '../../../constants/status-key.const';

export class CreateApprovalWorkflowStepDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly step_name: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly step_number: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsEnum(EnumWorkflowStep, {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly type: EnumWorkflowStep;

  @ApiProperty()
  @IsOptional()
  // @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  departmentId?: number;

  @ApiProperty()
  @IsOptional()
  // @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  userId?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  readonly requires_file?: boolean;
}
