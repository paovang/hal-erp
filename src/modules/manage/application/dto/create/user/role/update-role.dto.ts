import { PartialType } from '@nestjs/swagger';
import { CreateDto } from './create-role.dto';

export class UpdateDto extends PartialType(CreateDto) {}
