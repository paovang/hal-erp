import { EntityManager } from 'typeorm';
import { BudgetAccountQueryDto } from '../../dto/query/budget-account.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: BudgetAccountQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
