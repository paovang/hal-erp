import { EntityManager } from 'typeorm';
import { DepartmentQueryDto } from '../../dto/query/department-query.dto';

export class GetReportQuery {
  constructor(
    public readonly query: DepartmentQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
