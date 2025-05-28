import { IsBoolean, IsDefined } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UseBankAccountDto {
  @IsDefined({ message: i18nValidationMessage('validation.IS_DEFINED') })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  readonly is_selected: boolean;
}
