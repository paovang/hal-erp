import { ApiProperty, OmitType } from '@nestjs/swagger';
import {
  CreateDepartmentApproverByUserDto,
  CreateDepartmentApproverDto,
} from './create.dto';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateDepartmentApproverDto extends OmitType(
  CreateDepartmentApproverDto,
  ['user_id'] as const,
) {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  // @Optional()
  readonly user_id: number;
}
export class UpdateDepartmentApproverByUserDto extends OmitType(
  CreateDepartmentApproverByUserDto,
  ['user_id'] as const,
) {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  // @Optional()
  readonly user_id: number;
}
