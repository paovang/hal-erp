import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateDocumentTypeDto } from './create.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { NoSpecialChars } from '@src/common/validations/NoSpecialChars.validator';

export class UpdateDocumentTypeDto extends OmitType(CreateDocumentTypeDto, [
  'code',
] as const) {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(0, 10, { message: i18nValidationMessage('validation.LENGTH') })
  @NoSpecialChars({
    message: i18nValidationMessage('validation.NO_SPECIAL_CHARS'),
  })
  code: string;
}
