import { EntityManager } from 'typeorm';
import { CreateBudgetItemDto } from '../../dto/create/budgetItem/create.dto';
export class CreateCommand {
  constructor(
    public readonly dto: CreateBudgetItemDto,
    public readonly manager: EntityManager,
  ) {}
}
