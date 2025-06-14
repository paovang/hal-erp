import { EntityManager } from 'typeorm';
import { CreateBudgetAccountDto } from '../../dto/create/BudgetAccount/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateBudgetAccountDto,
    public readonly manager: EntityManager,
  ) {}
}
