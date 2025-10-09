import { EntityManager } from 'typeorm';
import {
  CreateDepartmentApproverByUserDto,
  CreateDepartmentApproverDto,
} from '../../dto/create/departmentApprover/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateDepartmentApproverDto,
    public readonly manager: EntityManager,
  ) {}
}
export class CreateByUserCommand {
  constructor(
    public readonly dto: CreateDepartmentApproverByUserDto,
    public readonly manager: EntityManager,
  ) {}
}
