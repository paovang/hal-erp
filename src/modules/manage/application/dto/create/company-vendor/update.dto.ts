import { PartialType } from '@nestjs/swagger';
import { CreateCompanyVendorDto } from './create.dto';

export class UpdateCompanyVendorDto extends PartialType(
  CreateCompanyVendorDto,
) {}
