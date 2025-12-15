import { EntityManager } from 'typeorm';
import { CreateProductDto } from '../../dto/create/product/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateProductDto,
    public readonly manager: EntityManager,
  ) {}
}
