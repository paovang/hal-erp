import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { RoleQueryDto } from "@src/modules/manage/application/dto/query/role-query.dto";
import { EntityManager } from "typeorm";
import { RoleEntity } from "../../entities/role.entity";
import { RoleId } from "../../value-objects/role-id.vo";

export interface IReadRoleRepository {
  findAll(
    query: RoleQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  findOne(
    id: RoleId,
    manager: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;
}