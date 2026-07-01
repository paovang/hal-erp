import { EntityManager } from 'typeorm';
import { UpdateCompanyVendorDto } from '../../dto/create/company-vendor/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateCompanyVendorDto,
    public readonly manager: EntityManager,
  ) {}
}
