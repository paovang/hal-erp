import { EntityManager } from 'typeorm';
import { UpdateDepartmentApproverDto } from '../../dto/create/departmentApprover/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDepartmentApproverDto,
    public readonly manager: EntityManager,
  ) {}
}
