import { EntityManager } from 'typeorm';
import { CreateDepartmentApproverDto } from '../../dto/create/departmentApprover/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateDepartmentApproverDto,
    public readonly manager: EntityManager,
  ) {}
}
