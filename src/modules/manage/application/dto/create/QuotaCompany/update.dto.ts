import { PartialType } from '@nestjs/swagger';
import { CreateQuotaCompanyDto } from './create.dto';

export class UpdateQuotaCompanyDto extends PartialType(CreateQuotaCompanyDto) {}