import { EntityManager } from 'typeorm';
import { BudgetAccountQueryDto } from '../../dto/query/budget-account.dto';

export class GetReportToUseBudgetQuery {
  constructor(
    public readonly query: BudgetAccountQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
