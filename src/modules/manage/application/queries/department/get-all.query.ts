import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import { EntityManager } from 'typeorm';

export class GetAllQuery {
  constructor(
    public readonly dto: DepartmentQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
