import { ApiProperty } from '@nestjs/swagger';
import { i18nValidationMessage } from 'nestjs-i18n';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Optional } from '@nestjs/common';
import { NoSpecialChars } from '@src/common/validations/NoSpecialChars.validator';

export class CreateDocumentTypeDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  @ApiProperty()
  @Optional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @Length(0, 10, { message: i18nValidationMessage('validation.LENGTH') })
  @NoSpecialChars({
    message: i18nValidationMessage('validation.NO_SPECIAL_CHARS'),
  })
  readonly code: string;
}
