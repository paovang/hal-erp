import { Inject, Injectable } from '@nestjs/common';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IReadBankRepository } from '@src/modules/manage/domain/ports/output/bank-repository.interace';
import { BankDataAccessMapper } from '../../mappers/bank.mapper';
import { BankEntity } from '@src/modules/manage/domain/entities/bank.entity';
import { BankId } from '@src/modules/manage/domain/value-objects/bank-id.vo';
import { BankOrmEntity } from '@src/common/infrastructure/database/typeorm/bank.orm';
import { BankQueryDto } from '@src/modules/manage/application/dto/query/bank-query.dto';

@Injectable()
export class ReadBankRepository implements IReadBankRepository {
  constructor(
    private readonly _dataAccessMapper: BankDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: BankQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<BankEntity>> {
    const queryBuilder = this.createBaseQuery(manager);
    query.sort_by = 'banks.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(BankOrmEntity, 'banks');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['banks.name', 'banks.short_name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: BankId,
    manager: EntityManager,
  ): Promise<ResponseResult<BankEntity>> {
    const item = await findOneOrFail(manager, BankOrmEntity, {
      id: id.value,
    });

    return this._dataAccessMapper.toEntity(item);
  }
}
