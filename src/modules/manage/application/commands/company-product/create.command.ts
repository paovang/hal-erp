import { EntityManager } from 'typeorm';
import { CreateCompanyProductDto } from '../../dto/create/company-product/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateCompanyProductDto,
    public readonly manager: EntityManager,
  ) {}
}
