import { EntityManager } from 'typeorm';
import { CurrencyEntity } from '../../entities/currency.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CurrencyQueryDto } from '@src/modules/manage/application/dto/query/currency-query.dto';
import { CurrencyId } from '../../value-objects/currency-id.vo';

export interface IWriteCurrencyRepository {
  create(
    entity: CurrencyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>>;

  update(
    entity: CurrencyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>>;

  delete(id: CurrencyId, manager: EntityManager): Promise<void>;
}

export interface IReadCurrencyRepository {
  findAll(
    query: CurrencyQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>>;

  findOne(
    id: CurrencyId,
    manager: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>>;
}
