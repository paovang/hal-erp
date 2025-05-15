import { UpdateDepartmentDto } from '@src/modules/manage/application/dto/create/department/update.dto';
import { EntityManager } from 'typeorm';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDepartmentDto,
    public readonly manager: EntityManager,
  ) {}
}
