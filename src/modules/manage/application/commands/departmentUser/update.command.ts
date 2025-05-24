import { EntityManager } from 'typeorm';
import { UpdateDepartmentUserDto } from '../../dto/create/departmentUser/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDepartmentUserDto,
    public readonly manager: EntityManager,
  ) {}
}
