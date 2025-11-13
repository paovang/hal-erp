import { EntityManager } from 'typeorm';
import { UpdateProductTypeDto } from '../../dto/create/product-type/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateProductTypeDto,
    public readonly manager: EntityManager,
  ) {}
}
