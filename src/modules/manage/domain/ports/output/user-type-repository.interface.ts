import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CurrencyId } from '../../value-objects/currency-id.vo';
import { UserTypeEntity } from '../../entities/user-type.entity';

export interface IWriteUserTypeRepository {
  create(
    entity: UserTypeEntity | UserTypeEntity[],
    manager: EntityManager,
  ): Promise<ResponseResult<UserTypeEntity[] | UserTypeEntity>>;

  update(
    entity: UserTypeEntity | UserTypeEntity[],
    manager: EntityManager,
  ): Promise<ResponseResult<UserTypeEntity>>;

  delete(id: CurrencyId, manager: EntityManager): Promise<void>;
}

export interface IReadUserTypeRepository {
  findOne(
    id: CurrencyId,
    manager: EntityManager,
  ): Promise<ResponseResult<UserTypeEntity>>;
}
