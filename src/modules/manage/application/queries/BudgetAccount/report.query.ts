import { EntityManager } from 'typeorm';
import { BudgetAccountQueryDto } from '../../dto/query/budget-account.dto';

export class GetReportQuery {
  constructor(
    public readonly id: number,
    public readonly dto: BudgetAccountQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
