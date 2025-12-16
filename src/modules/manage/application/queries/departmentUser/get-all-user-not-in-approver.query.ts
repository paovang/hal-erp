import { EntityManager } from 'typeorm';
import { DepartmentUserQueryDto } from '../../dto/query/department-user-query.dto';

export class getAllNotHaveInApproversQuery {
  constructor(
    public readonly dto: DepartmentUserQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
