import { EntityManager } from 'typeorm';
import { IncreaseBudgetQueryDto } from '../../dto/query/increase-budget.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: IncreaseBudgetQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
