import { EntityManager } from 'typeorm';
import { CreateQuotaCompanyDto } from '../../dto/create/QuotaCompany/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateQuotaCompanyDto,
    public readonly manager: EntityManager,
  ) {}
}