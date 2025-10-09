import { EntityManager } from 'typeorm';
import { IncreaseBudgetDetailQueryDto } from '../../dto/query/increase-budget-detail.dto';

export class GetAllQuery {
  constructor(
    public readonly id: number,
    public readonly dto: IncreaseBudgetDetailQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
