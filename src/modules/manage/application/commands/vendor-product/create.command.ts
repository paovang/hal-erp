import { EntityManager } from 'typeorm';
import { CreateVendorProductDto } from '../../dto/create/vendor-product/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateVendorProductDto,
    public readonly manager: EntityManager,
  ) {}
}