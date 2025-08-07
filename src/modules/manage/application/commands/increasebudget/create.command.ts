import { EntityManager } from 'typeorm';
import { CreateIncreaseBudgetDto } from '../../dto/create/increaseBudgetFile/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateIncreaseBudgetDto,
    public readonly manager: EntityManager,
  ) {}
}
