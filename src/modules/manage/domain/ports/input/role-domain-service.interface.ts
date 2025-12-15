import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { RoleQueryDto } from '@src/modules/manage/application/dto/query/role-query.dto';
import { EntityManager } from 'typeorm';
import { RoleEntity } from '../../entities/role.entity';
import { CreateRoleDto } from '@src/modules/manage/application/dto/create/user/role/create.dto';
import { UpdateRoleDto } from '@src/modules/manage/application/dto/create/user/role/update.dto';
import { CreateDto } from '@src/modules/manage/application/dto/create/user/role/create-role.dto';
import { UpdateDto } from '@src/modules/manage/application/dto/create/user/role/update-role.dto';

export interface IRoleServiceInterface {
  getAll(
    dto: RoleQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  getAllForCompany(
    dto: RoleQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  getAllForCompanyUser(
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

  createRole(
    dto: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;

  updateRole(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>>;
}
