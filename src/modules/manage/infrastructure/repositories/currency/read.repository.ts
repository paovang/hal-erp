import { Inject, Injectable } from '@nestjs/common';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { CurrencyQueryDto } from '@src/modules/manage/application/dto/query/currency-query.dto';
import { CurrencyEntity } from '@src/modules/manage/domain/entities/currency.entity';
import { IReadCurrencyRepository } from '@src/modules/manage/domain/ports/output/currency-repository.interface';
import { EntityManager } from 'typeorm';
import { CurrencyDataAccessMapper } from '../../mappers/currency.mapper';
import { CurrencyId } from '@src/modules/manage/domain/value-objects/currency-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@Injectable()
export class ReadCurrencyRepository implements IReadCurrencyRepository {
  constructor(
    private readonly _dataAccessMapper: CurrencyDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: CurrencyQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'currencies.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(CurrencyOrmEntity, 'currencies');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['currencies.name', 'currencies.code'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: CurrencyId,
    manager: EntityManager,
  ): Promise<ResponseResult<CurrencyEntity>> {
    const item = await findOneOrFail(manager, CurrencyOrmEntity, {
      id: id.value,
    });

    return this._dataAccessMapper.toEntity(item);
  }
}
