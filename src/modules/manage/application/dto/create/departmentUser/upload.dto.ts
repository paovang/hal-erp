import { ApiProperty } from '@nestjs/swagger';
// import { IsNotEmpty } from 'class-validator';
// import { i18nValidationMessage } from 'nestjs-i18n';

export class UploadFileDto {
  @ApiProperty()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  file: string;
}
