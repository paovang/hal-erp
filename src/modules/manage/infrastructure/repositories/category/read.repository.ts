import { Inject, Injectable } from '@nestjs/common';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/application/interfaces/pagination.interface';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';
import { CategoryQueryDto } from '@src/modules/manage/application/dto/query/category-query.dto';
import { CategoryEntity } from '@src/modules/manage/domain/entities/category.entity';
import { IReadCategoryRepository } from '@src/modules/manage/domain/ports/output/category-repository.interface';
import { EntityManager } from 'typeorm';
import { CategoryDataAccessMapper } from '../../mappers/category.mapper';
import { CategoryId } from '@src/modules/manage/domain/value-objects/category-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@Injectable()
export class ReadCategoryRepository implements IReadCategoryRepository {
  constructor(
    private readonly _dataAccessMapper: CategoryDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: CategoryQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'categories.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(CategoryOrmEntity, 'categories');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['categories.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: CategoryId,
    manager: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>> {
    const item = await findOneOrFail(manager, CategoryOrmEntity, {
      id: id.value,
    });

    return this._dataAccessMapper.toEntity(item);
  }
}
