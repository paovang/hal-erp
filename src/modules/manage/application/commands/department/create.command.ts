import { EntityManager } from 'typeorm';
import { CreateDepartmentDto } from '@src/modules/manage/application/dto/create/department/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateDepartmentDto,
    public readonly manager: EntityManager,
  ) {}
}
