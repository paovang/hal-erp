import { EntityManager } from 'typeorm';
import { UpdateVendorProductDto } from '../../dto/create/vendor-product/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateVendorProductDto,
    public readonly manager: EntityManager,
  ) {}
}