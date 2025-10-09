import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreatePurchaseRequestItemDto } from '../purchaseRequestItem/create.dto';
import { CreateDocumentDto } from '../Document/create.dto';

export class CreatePurchaseRequestDto {
  // @ApiProperty()
  // @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  // @IsDate({ message: i18nValidationMessage('validation.IS_DATE') })
  // @Type(() => Date)
  // readonly requested_date: Date;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsDate({ message: i18nValidationMessage('validation.IS_DATE') })
  @Type(() => Date)
  readonly expired_date: Date;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly purposes: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  document: CreateDocumentDto;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @ArrayNotEmpty({
    message: i18nValidationMessage('validation.ARRAY_NOT_EMPTY'),
  })
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseRequestItemDto)
  readonly purchase_request_items: CreatePurchaseRequestItemDto[];
}
