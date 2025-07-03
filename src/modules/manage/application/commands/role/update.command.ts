import { EntityManager } from 'typeorm';
import { UpdateRoleDto } from '../../dto/create/user/role/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateRoleDto,
    public readonly manager: EntityManager,
  ) {}
}
