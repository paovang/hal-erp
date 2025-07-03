import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { RoleQueryDto } from '@src/modules/manage/application/dto/query/role-query.dto';
import { EntityManager } from 'typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { RoleId } from '../../value-objects/role-id.vo';

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

export interface IWriteRoleRepository {
  create(
    entity: RoleEntity,
    manager: EntityManager,
    permissions?: number[],
  ): Promise<ResponseResult<RoleEntity>>;

  update(
    entity: RoleEntity,
    manager: EntityManager,
    permissions?: number[],
  ): Promise<ResponseResult<RoleEntity>>;

  delete(id: RoleId, manager: EntityManager): Promise<void>;
}
