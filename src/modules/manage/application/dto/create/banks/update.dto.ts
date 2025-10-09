import { PartialType } from '@nestjs/swagger';
import { CreateBankDto } from './create.dto';

export class UpdateBankDto extends PartialType(CreateBankDto) {}
