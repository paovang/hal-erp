import { EntityManager } from 'typeorm';
import {
  UpdateDepartmentApproverByUserDto,
  UpdateDepartmentApproverDto,
} from '../../dto/create/departmentApprover/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDepartmentApproverDto,
    public readonly manager: EntityManager,
  ) {}
}
export class UpdateByUserCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDepartmentApproverByUserDto,
    public readonly manager: EntityManager,
  ) {}
}
