import { EntityManager } from "typeorm/entity-manager/EntityManager";
import { CreateDepartmentUserDto } from "../../dto/create/departmentUser/create.dto";

export class CreateCommand {
  constructor(
    public readonly dto: CreateDepartmentUserDto,
    public readonly manager: EntityManager,
  ) {}
}