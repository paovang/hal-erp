import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateProductDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly description?: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly product_type_id: number;

  @ApiProperty({ enum: ['active', 'inactive'], default: 'active' })
  @IsEnum(['active', 'inactive'], {
    message: i18nValidationMessage('validation.IS_ENUM'),
  })
  readonly status: 'active' | 'inactive' = 'active';

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  @Type(() => Number)
  readonly unit_id: number;
}
