import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { CreateVatDto } from '@src/modules/manage/application/dto/create/vat/create.dto';
import { UpdateVatDto } from '@src/modules/manage/application/dto/create/vat/update.dto';
import { ExchangeRateQueryDto } from '@src/modules/manage/application/dto/query/exchange-rate-query.dto';
import { ExchangeRateEntity } from '../../entities/exchange-rate.entity';

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
    dto: CreateVatDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;

  update(
    id: number,
    dto: UpdateVatDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
