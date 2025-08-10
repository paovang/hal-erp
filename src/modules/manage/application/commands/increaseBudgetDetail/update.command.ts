import { EntityManager } from 'typeorm';
import { UpdateIncreaseBudgetDetailDto } from '../../dto/create/increaseBudgetDetail/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateIncreaseBudgetDetailDto,
    public readonly manager: EntityManager,
  ) {}
}
