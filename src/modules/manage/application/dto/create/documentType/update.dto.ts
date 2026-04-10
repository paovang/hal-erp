import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateDocumentTypeDto } from './create.dto';
<<<<<<< HEAD
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
=======
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
>>>>>>> generate-code
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

  @ApiProperty()
<<<<<<< HEAD
  @IsOptional()

  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
=======
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
>>>>>>> generate-code
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly categoryId: number;
}
