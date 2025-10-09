import { EntityManager } from 'typeorm';
import { UpdateIncreaseBudgetDto } from '../../dto/create/increaseBudget/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateIncreaseBudgetDto,
    public readonly manager: EntityManager,
  ) {}
}
