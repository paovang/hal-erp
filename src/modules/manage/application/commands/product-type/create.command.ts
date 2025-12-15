import { EntityManager } from 'typeorm';
import { CreateProductTypeDto } from '../../dto/create/product-type/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateProductTypeDto,
    public readonly manager: EntityManager,
  ) {}
}
