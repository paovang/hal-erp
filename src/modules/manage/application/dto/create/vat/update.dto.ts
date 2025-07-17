import { PartialType } from '@nestjs/swagger';
import { CreateVatDto } from './create.dto';

export class UpdateVatDto extends PartialType(CreateVatDto) {}
