import { EntityManager } from 'typeorm';
import { CreateCompanyDto } from '@src/modules/manage/application/dto/create/company/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateCompanyDto,
    public readonly manager: EntityManager,
  ) {}
}