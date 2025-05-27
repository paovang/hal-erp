import { PartialType } from '@nestjs/swagger';
import { CreateVendorDto } from './create.dto';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {}
