import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserEntity } from '../../entities/user.entity';
import { EntityManager } from 'typeorm';
import { UserQueryDto } from '@src/modules/manage/application/dto/query/user-query.dto';
import { UserId } from '../../value-objects/user-id.vo';

export interface IWriteUserRepository {
  create(
    entity: UserEntity,
    manager: EntityManager,
    roleIds?: number[],
    permissionIds?: number[],
  ): Promise<ResponseResult<UserEntity>>;

  createWithCompany(
    entity: UserEntity,
    manager: EntityManager,
    role_id: number,
  ): Promise<ResponseResult<UserEntity>>;

  update(
    entity: UserEntity,
    manager: EntityManager,
    roleIds?: number[],
    permissionIds?: number[],
  ): Promise<ResponseResult<UserEntity>>;

  changePassword(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  updateColumns(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  sendMail(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  delete(id: UserId, manager: EntityManager): Promise<void>;
}

export interface IReadUserRepository {
  findAll(
    query: UserQueryDto,
    manager: EntityManager,
    userId?: number,
    company_id?: number,
  ): Promise<ResponseResult<UserEntity>>;

  findOne(
    id: UserId,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;
}
