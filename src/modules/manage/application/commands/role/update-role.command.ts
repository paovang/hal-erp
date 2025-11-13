import { EntityManager } from 'typeorm';
import { UpdateDto } from '../../dto/create/user/role/update-role.dto';

export class UpdateRoleCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDto,
    public readonly manager: EntityManager,
  ) {}
}
