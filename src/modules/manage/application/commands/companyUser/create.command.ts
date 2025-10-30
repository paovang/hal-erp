import { EntityManager } from 'typeorm';
import { CreateCompanyUserDto } from '../../dto/create/companyUser/create.dto';

export class CreateCompanyUserCommand {
  constructor(
    public readonly dto: CreateCompanyUserDto,
    public readonly manager: EntityManager,
  ) {}
}
