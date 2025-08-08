import { EntityManager } from 'typeorm';
import { CreateIncreaseBudgetDetailDto } from '../../dto/create/increaseBudgetDetail/create.dto';

export class CreateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: CreateIncreaseBudgetDetailDto,
    public readonly manager: EntityManager,
  ) {}
}
