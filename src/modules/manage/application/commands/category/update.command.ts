import { EntityManager } from 'typeorm';
import { UpdateCategoryDto } from '../../dto/create/category/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateCategoryDto,
    public readonly manager: EntityManager,
  ) {}
}
