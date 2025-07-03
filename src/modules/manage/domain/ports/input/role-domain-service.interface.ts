import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { RoleQueryDto } from '@src/modules/manage/application/dto/query/role-query.dto';
import { EntityManager } from 'typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { CreateRoleDto } from '@src/modules/manage/application/dto/create/user/role/create.dto';
import { UpdateRoleDto } from '@src/modules/manage/application/dto/create/user/role/update.dto';

export interface IRoleServiceInterface {
  getAll(
    dto: RoleQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  create(
    dto: CreateRoleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  update(
    id: number,
    dto: UpdateRoleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
