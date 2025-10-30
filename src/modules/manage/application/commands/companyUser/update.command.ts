import { EntityManager } from 'typeorm';
import { UpdateCompanyUserDto } from '../../dto/create/companyUser/update.dto';

export class UpdateCompanyUserCommand {
  constructor(
    public id: number,
    public body: UpdateCompanyUserDto,
    public manager: EntityManager,
  ) {}
}
