import { EntityManager } from 'typeorm';
import { UpdateBudgetItemDto } from '../../dto/create/budgetItem/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateBudgetItemDto,
    public readonly manager: EntityManager,
  ) {}
}
