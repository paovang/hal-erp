import { EntityManager } from 'typeorm';
import { CreateRoleDto } from '../../dto/create/user/role/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateRoleDto,
    public readonly manager: EntityManager,
  ) {}
}
