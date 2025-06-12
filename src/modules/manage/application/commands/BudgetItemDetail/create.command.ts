import { EntityManager } from 'typeorm';
import { CreateBudgetItemDetailDto } from '../../dto/create/budgetItemDetail/create.dto';

export class CreateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: CreateBudgetItemDetailDto,
    public readonly manager: EntityManager,
  ) {}
}
