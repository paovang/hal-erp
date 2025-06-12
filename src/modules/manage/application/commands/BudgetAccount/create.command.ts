import { EntityManager } from 'typeorm';
import { CreateBudgetAccountDto } from '../../dto/create/budgetAccount/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateBudgetAccountDto,
    public readonly manager: EntityManager,
  ) {}
}
