import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreatePurchaseOrderSelectedVendorDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  readonly vendor_id: number;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  readonly filename: string;

  @ApiProperty()
  @IsOptional()
  readonly reason: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsBoolean({ message: i18nValidationMessage('validation.IS_BOOLEAN') })
  readonly selected: boolean;
}
