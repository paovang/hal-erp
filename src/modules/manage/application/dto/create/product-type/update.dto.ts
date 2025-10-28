import { PartialType } from '@nestjs/swagger';
import { CreateProductTypeDto } from './create.dto';

export class UpdateProductTypeDto extends PartialType(CreateProductTypeDto) {}