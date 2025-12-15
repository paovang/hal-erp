import { UpdateCompanyDto } from '@src/modules/manage/application/dto/create/company/update.dto';
import { EntityManager } from 'typeorm';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateCompanyDto,
    public readonly manager: EntityManager,
  ) {}
}
