import { EntityManager } from "typeorm";
import { RoleQueryDto } from "../../../dto/query/role-query.dto";

export class GetAllQuery {
  constructor(
    public readonly dto: RoleQueryDto,
    public readonly manager: EntityManager,
  ) {}
}