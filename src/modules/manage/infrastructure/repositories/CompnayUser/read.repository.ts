import { Inject, Injectable } from '@nestjs/common';
import { IReadCompanyUserRepository } from '@src/modules/manage/domain/ports/output/company-user-repository.interface';
import { CompanyUserDataAccessMapper } from '../../mappers/company-user.mapper';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyUserQueryDto } from '@src/modules/manage/application/dto/query/company-user-query.dto';
import { EntityManager } from 'typeorm';
import { CompanyUserEntity } from '@src/modules/manage/domain/entities/company-user.entity';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@Injectable()
export class ReadCompanyUserRepository implements IReadCompanyUserRepository {
  constructor(
    private readonly _dataAccessMapper: CompanyUserDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: CompanyUserQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'company_users.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  // async findOne(
  //   id: CompanyId,
  //   manager: EntityManager,
  // ): Promise<ResponseResult<CompanyEntity>> {
  //   const item = await this.createBaseQuery(manager)
  //     .where('companies.id = :id', { id: id.value })
  //     .getOneOrFail();

  //   return this._dataAccessMapper.toEntity(item);
  // }

  private createBaseQuery(manager: EntityManager) {
    const queryBuilder = manager
      .createQueryBuilder(CompanyUserOrmEntity, 'company_users')
      .leftJoinAndSelect('company_users.company', 'company')
      .leftJoinAndSelect('company_users.user', 'user')
      .leftJoinAndSelect('user.user_signatures', 'user_signatures');

    return queryBuilder;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['company.name', 'company.email', 'company.tel'],
      dateColumn: '',
      filterByColumns: [],
    };
  }
}
