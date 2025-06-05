import { EntityManager } from 'typeorm';
import { UpdateBudgetAccountDto } from '../../dto/create/BudgetAccount/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateBudgetAccountDto,
    public readonly manager: EntityManager,
  ) {}
}
