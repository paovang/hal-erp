import { EntityManager } from 'typeorm';
import { CreateCategoryDto } from '../../dto/create/category/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateCategoryDto,
    public readonly manager: EntityManager,
  ) {}
}
