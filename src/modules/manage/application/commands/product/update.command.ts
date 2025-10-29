import { EntityManager } from 'typeorm';
import { UpdateProductDto } from '../../dto/create/product/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateProductDto,
    public readonly manager: EntityManager,
  ) {}
}