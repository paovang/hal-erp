import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { PermissionQueryDto } from "@src/modules/manage/application/dto/query/permission-query.dto";
import { EntityManager } from "typeorm";
import { PermissionGroupEntity } from "../../entities/permission-group.entity";
import { PermissionGroupId } from "../../value-objects/permission-group-id.vo";

export interface IReadPermissionRoleRepository {
  findAll(
    query: PermissionQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<PermissionGroupEntity>>;

  findOne(
    id: PermissionGroupId,
    manager: EntityManager,
  ): Promise<ResponseResult<PermissionGroupEntity>>;
}