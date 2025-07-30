import { EntityManager } from 'typeorm';
import { UpdateBudgetItemDetailDto } from '../../dto/create/BudgetItemDetail/update.dto';
export class UpdateBudgetItemDetailCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateBudgetItemDetailDto,
    public readonly manager: EntityManager,
  ) {}
}
