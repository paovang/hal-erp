import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class OrderByApprovalWorkflowStepDto {
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('validation.ARRAY_NOT_EMPTY'),
  })
  @IsNumber(
    {},
    { each: true, message: i18nValidationMessage('validation.IS_NUMBER') },
  )
  readonly ids: number[];
}
