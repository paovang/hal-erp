import { PartialType } from '@nestjs/swagger';
import { CreateUserTypeDto } from './create.dto';

export class UpdateUserTypeDto extends PartialType(CreateUserTypeDto) {}
