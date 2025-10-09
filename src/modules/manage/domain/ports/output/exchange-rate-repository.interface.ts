import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ExchangeRateEntity } from '../../entities/exchange-rate.entity';
import { ExchangeRateId } from '../../value-objects/exchange-rate-id.vo';
import { ExchangeRateQueryDto } from '@src/modules/manage/application/dto/query/exchange-rate-query.dto';

export interface IWriteExchangeRateRepository {
  create(
    entity: ExchangeRateEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;

  update(
    entity: ExchangeRateEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;

  delete(id: ExchangeRateId, manager: EntityManager): Promise<void>;
}

export interface IReadExchangeRateRepository {
  findAll(
    query: ExchangeRateQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;

  findOne(
    id: ExchangeRateId,
    manager: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;
}
