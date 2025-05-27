import { PartialType } from '@nestjs/swagger';
import { CreateVendorBankAccountDto } from './create.dto';

export class UpdateVendorBankAccountDto extends PartialType(
  CreateVendorBankAccountDto,
) {}
