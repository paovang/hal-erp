import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { UserEntity } from '../../entities/user.entity';
import { EntityManager } from 'typeorm';
import { UserQueryDto } from '@src/modules/manage/application/dto/query/user-query.dto';
import { UserId } from '../../value-objects/user-id.vo';

export interface IWriteUserRepository {
  create(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  update(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  updateColumns(
    entity: UserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  delete(id: UserId, manager: EntityManager): Promise<void>;
}

export interface IReadUserRepository {
  findAll(
    query: UserQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;

  findOne(
    id: UserId,
    manager: EntityManager,
  ): Promise<ResponseResult<UserEntity>>;
}
