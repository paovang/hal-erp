import { EntityManager } from 'typeorm';
import { BudgetAccountQueryDto } from '../../dto/query/budget-account.dto';

export class GetReportHalGroupMonthBudgetQuery {
  constructor(
    public readonly query: BudgetAccountQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
