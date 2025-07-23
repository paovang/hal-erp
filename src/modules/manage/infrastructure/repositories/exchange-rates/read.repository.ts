import { Inject, Injectable } from '@nestjs/common';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  // FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { IReadExchangeRateRepository } from '@src/modules/manage/domain/ports/output/exchange-rate-repository.interface';
import { ExchangeRateDataAccessMapper } from '../../mappers/exchange-rate.mapper';
import { ExchangeRateQueryDto } from '@src/modules/manage/application/dto/query/exchange-rate-query.dto';
import { ExchangeRateEntity } from '@src/modules/manage/domain/entities/exchange-rate.entity';
import { ExchangeRateOrmEntity } from '@src/common/infrastructure/database/typeorm/exchange-rate.orm';
import { ExchangeRateId } from '@src/modules/manage/domain/value-objects/exchange-rate-id.vo';

@Injectable()
export class ReadExchangeRateRepository implements IReadExchangeRateRepository {
  constructor(
    private readonly _dataAccessMapper: ExchangeRateDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: ExchangeRateQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    const queryBuilder = this.createBaseQuery(
      manager,
      Number(query.from_currency_id),
      Number(query.to_currency_id),
    );
    query.sort_by = 'exchange_rates.id';
    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      // this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(
    manager: EntityManager,
    from_currency_id?: number,
    to_currency_id?: number,
  ) {
    const query = manager
      .createQueryBuilder(ExchangeRateOrmEntity, 'exchange_rates')
      .leftJoin('exchange_rates.from_currency', 'from_currency')
      .leftJoin('exchange_rates.to_currency', 'to_currency')
      .select([
        // Exchange rate fields
        'exchange_rates.id',
        'exchange_rates.from_currency_id',
        'exchange_rates.to_currency_id',
        'exchange_rates.rate',
        'exchange_rates.is_active',
        'exchange_rates.created_at',
        'exchange_rates.updated_at',
        'exchange_rates.deleted_at',
        // From currency fields
        'from_currency.id',
        'from_currency.code',
        'from_currency.name',
        // To currency fields
        'to_currency.id',
        'to_currency.code',
        'to_currency.name',
      ]);
    if (from_currency_id && to_currency_id) {
      query.andWhere(
        '((exchange_rates.from_currency_id = :currency1 AND exchange_rates.to_currency_id = :currency2))',
        {
          currency1: from_currency_id,
          currency2: to_currency_id,
        },
      );
    }
    return query; // ❗ return queryBuilder object
  }

  // private getFilterOptions(): FilterOptions {
  //   return {
  //     searchColumns: ['exchange_rates.name', 'document_types.name'],
  //     dateColumn: '',
  //     filterByColumns: [],
  //   };
  // }

  async findOne(
    id: ExchangeRateId,
    manager: EntityManager,
  ): Promise<ResponseResult<ExchangeRateEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('exchange_rates.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
