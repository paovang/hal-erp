import { EntityManager } from 'typeorm';
import { CreateIncreaseBudgetDto } from '../../dto/create/increaseBudget/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateIncreaseBudgetDto,
    public readonly manager: EntityManager,
  ) {}
}
