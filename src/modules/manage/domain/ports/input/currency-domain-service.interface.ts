import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCurrencyDto } from '@src/modules/manage/application/dto/create/currency/create.dto';
import { EntityManager } from 'typeorm';
import { CurrencyEntity } from '../../entities/currency.entity';
import { CurrencyQueryDto } from '@src/modules/manage/application/dto/query/currency-query.dto';
import { UpdateCurrencyDto } from '@src/modules/manage/application/dto/create/currency/update.dto';

export interface ICurrencyServiceInterface {
  getAll(
    dto: CurrencyQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>>;

  create(
    dto: CreateCurrencyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>>;

  update(
    id: number,
    dto: UpdateCurrencyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
