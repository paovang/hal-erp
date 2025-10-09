import { EntityManager } from 'typeorm';
import { BudgetItemDetailQueryDto } from '../../dto/query/budget-item-detail.dto';

export class GetAllQuery {
  constructor(
    public readonly id: number,
    public readonly dto: BudgetItemDetailQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
