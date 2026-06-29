import { EntityManager } from 'typeorm';
import { UpdateCompanyProductDto } from '../../dto/create/company-product/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateCompanyProductDto,
    public readonly manager: EntityManager,
  ) {}
}
