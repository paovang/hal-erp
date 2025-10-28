import { Inject, Injectable } from '@nestjs/common';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { IReadCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { CompanyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/company.mapper';
import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { EntityManager } from 'typeorm';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';

@Injectable()
export class ReadCompanyRepository implements IReadCompanyRepository {
  constructor(
    private readonly _dataAccessMapper: CompanyDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: CompanyQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'companies.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data as ResponseResult<CompanyEntity>;
  }

  async findOne(
    id: CompanyId,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('companies.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(CompanyOrmEntity, 'companies');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['companies.name', 'companies.email', 'companies.tel'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
