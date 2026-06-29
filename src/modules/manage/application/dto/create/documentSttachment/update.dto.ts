import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateDocumentAttachmentDto {
  @ApiProperty({
    required: false,
    description:
      'Staged file name located in assets/uploads. Omit or leave empty to remove the current file.',
  })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly file_name?: string;
}
