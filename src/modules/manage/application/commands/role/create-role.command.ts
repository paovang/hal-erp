import { EntityManager } from 'typeorm';
import { CreateDto } from '../../dto/create/user/role/create-role.dto';

export class CreateRoleCommand {
  constructor(
    public readonly dto: CreateDto,
    public readonly manager: EntityManager,
  ) {}
}
