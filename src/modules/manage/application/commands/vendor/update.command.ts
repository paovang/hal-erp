import { EntityManager } from 'typeorm';
import { UpdateVendorDto } from '../../dto/create/vendor/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateVendorDto,
    public readonly manager: EntityManager,
  ) {}
}
