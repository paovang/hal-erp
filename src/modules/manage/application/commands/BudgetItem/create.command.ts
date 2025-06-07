import { EntityManager } from 'typeorm';
import { CreateBudgetItemDto } from '../../dto/create/BudgetItem/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateBudgetItemDto,
    public readonly manager: EntityManager,
  ) {}
}
