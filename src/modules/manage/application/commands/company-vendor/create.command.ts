import { EntityManager } from 'typeorm';
import { CreateCompanyVendorDto } from '../../dto/create/company-vendor/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateCompanyVendorDto,
    public readonly manager: EntityManager,
  ) {}
}
