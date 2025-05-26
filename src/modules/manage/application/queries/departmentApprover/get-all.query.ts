import { EntityManager } from 'typeorm';
import { DepartmentApproverQueryDto } from '../../dto/query/department-approver.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: DepartmentApproverQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
