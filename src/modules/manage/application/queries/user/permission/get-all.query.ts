import { EntityManager } from "typeorm";
import { PermissionQueryDto } from "../../../dto/query/permission-query.dto";

export class GetAllQuery {
  constructor(
    public readonly dto: PermissionQueryDto,
    public readonly manager: EntityManager,
  ) {}
}