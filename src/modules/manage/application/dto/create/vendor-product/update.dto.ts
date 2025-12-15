import { PartialType } from '@nestjs/swagger';
import { CreateVendorProductDto } from './create.dto';

export class UpdateVendorProductDto extends PartialType(
  CreateVendorProductDto,
) {}
