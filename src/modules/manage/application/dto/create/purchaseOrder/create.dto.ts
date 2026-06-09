import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { Type } from 'class-transformer';
import { CreateDocumentDto } from '../Document/create.dto';
import { CreatePurchaseOrderItemDto } from '../purchaseOrderItem/create.dto';

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly purchase_request_id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly purposes?: string;

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
  @Type(() => CreatePurchaseOrderItemDto)
  readonly items: CreatePurchaseOrderItemDto[];
}
