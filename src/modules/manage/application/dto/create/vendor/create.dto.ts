import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CreateVendorBankAccountDto } from '../vendorBankAccount/create.dto';
import { Optional } from '@nestjs/common';

export class NestedVendorBankAccountDto extends OmitType(
  CreateVendorBankAccountDto,
  ['vendor_id'] as const,
) {}
export class CreateVendorDto {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  readonly contact_info: string;

  @IsArray({ message: i18nValidationMessage('validation.IS_ARRAY') })
  @Optional()
  @ValidateNested({ each: true })
  @Type(() => NestedVendorBankAccountDto)
  vendor_bank_account: NestedVendorBankAccountDto[];
}
