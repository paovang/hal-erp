import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePurchaseOrderSelectedVendorDto } from './create.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdatePurchaseOrderSelectedVendorDto extends PartialType(
  CreatePurchaseOrderSelectedVendorDto,
) {
  @ApiProperty()
  @IsNotEmpty({ message: i18nValidationMessage('validation.IS_NOT_EMPTY') })
  @IsNumber({}, { message: i18nValidationMessage('validation.IS_NUMBER') })
  id: number;
}
