import { EntityManager } from 'typeorm';
import { BudgetItemQueryDto } from '../../dto/query/budget-item.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: BudgetItemQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
