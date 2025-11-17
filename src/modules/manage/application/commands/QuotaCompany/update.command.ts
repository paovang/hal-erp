import { EntityManager } from 'typeorm';
import { UpdateQuotaCompanyDto } from '../../dto/create/QuotaCompany/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateQuotaCompanyDto,
    public readonly manager: EntityManager,
  ) {}
}