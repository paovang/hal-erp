import { EntityManager } from 'typeorm';
import { UpdateBudgetItemDto } from '../../dto/create/BudgetItem/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateBudgetItemDto,
    public readonly manager: EntityManager,
  ) {}
}
