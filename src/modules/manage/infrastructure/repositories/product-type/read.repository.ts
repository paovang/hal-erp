import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { IReadProductTypeRepository } from '@src/modules/manage/domain/ports/output/product-type-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { ProductTypeDataAccessMapper } from '../../mappers/product-type.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { ProductTypeQueryDto } from '@src/modules/manage/application/dto/query/product-type-query.dto';
import { ProductTypeEntity } from '@src/modules/manage/domain/entities/product-type.entity';
import { ProductTypeId } from '@src/modules/manage/domain/value-objects/product-type-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@Injectable()
export class ReadProductTypeRepository implements IReadProductTypeRepository {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly _productTypeOrm: Repository<ProductTypeOrmEntity>,
    private readonly _dataAccessMapper: ProductTypeDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: ProductTypeQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'product_types.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager
      .createQueryBuilder(ProductTypeOrmEntity, 'product_types')
      .leftJoinAndSelect('product_types.category', 'category');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['product_types.name'],
      dateColumn: '',
      filterByColumns: ['product_types.category_id'],
    };
  }

  async findOne(
    id: ProductTypeId,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>> {
    const item = await findOneOrFail(manager, ProductTypeOrmEntity, {
      id: id.value,
    });

    // Load category relation if needed
    const itemWithRelation = await manager.findOne(ProductTypeOrmEntity, {
      where: { id: id.value },
      relations: ['category'],
    });

    return this._dataAccessMapper.toEntity(itemWithRelation || item);
  }
}
