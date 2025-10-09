import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ExchangeRateQueryDto } from '@src/modules/manage/application/dto/query/exchange-rate-query.dto';
import { ExchangeRateEntity } from '../../entities/exchange-rate.entity';
import { CreateExchangeRateDto } from '@src/modules/manage/application/dto/create/exchange-rates/create.dto';
import { UpdateExchangeRateDto } from '@src/modules/manage/application/dto/create/exchange-rates/update.dto';

export interface IExchangeRateServiceInterface {
  getAll(
    dto: ExchangeRateQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;

  create(
    dto: CreateExchangeRateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;

  update(
    id: number,
    dto: UpdateExchangeRateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
