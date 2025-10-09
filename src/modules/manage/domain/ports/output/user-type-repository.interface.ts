import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserTypeEntity } from '../../entities/user-type.entity';
import { UserTypeId } from '../../value-objects/user-type-id.vo';

export interface IWriteUserTypeRepository {
  create(
    entity: UserTypeEntity | UserTypeEntity[],
    manager: EntityManager,
  ): Promise<ResponseResult<UserTypeEntity[] | UserTypeEntity>>;

  update(
    entity: UserTypeEntity | UserTypeEntity[],
    manager: EntityManager,
  ): Promise<ResponseResult<UserTypeEntity>>;

  delete(id: UserTypeId, manager: EntityManager): Promise<void>;
}

export interface IReadUserTypeRepository {
  findOne(
    id: UserTypeId,
    manager: EntityManager,
  ): Promise<ResponseResult<UserTypeEntity>>;
}
