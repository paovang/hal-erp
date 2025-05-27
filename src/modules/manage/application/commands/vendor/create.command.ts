import { EntityManager } from 'typeorm';
import { CreateVendorDto } from '../../dto/create/vendor/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateVendorDto,
    public readonly manager: EntityManager,
  ) {}
}
