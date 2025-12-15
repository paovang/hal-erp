import { EntityManager } from 'typeorm';
import { RoleQueryDto } from '../../../dto/query/role-query.dto';

export class GetAllForCompanyUserQuery {
  constructor(
    public readonly dto: RoleQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
