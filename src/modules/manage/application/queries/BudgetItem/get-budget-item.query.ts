import { EntityManager } from 'typeorm';
import { BudgetItemQueryDto } from '../../dto/query/budget-item.dto';

export class GetBudgetItemQuery {
  constructor(
    public readonly query: BudgetItemQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
