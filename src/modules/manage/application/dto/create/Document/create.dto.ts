import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateDocumentDto {
  @ApiProperty()
  @IsOptional()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly title: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly description: string;

  @ApiProperty()
  @IsOptional()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly total_amount: number;

  @ApiProperty()
  @IsOptional()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  // @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly departmentId: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly documentTypeId: number;
}
