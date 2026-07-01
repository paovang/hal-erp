import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';
import { IReadProductRepository } from '@src/modules/manage/domain/ports/output/product-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { ProductDataAccessMapper } from '../../mappers/product.mapper';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@common/infrastructure/pagination/pagination.interface';
import { ProductQueryDto } from '@src/modules/manage/application/dto/query/product-query.dto';
import { ProductEntity } from '@src/modules/manage/domain/entities/product.entity';
import { ProductId } from '@src/modules/manage/domain/value-objects/product-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@Injectable()
export class ReadProductRepository implements IReadProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly _productOrm: Repository<ProductOrmEntity>,
    private readonly _dataAccessMapper: ProductDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: ProductQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);

    // Opt-in company filter: the catalog stays full by default. Only when a
    // company_id is explicitly supplied (e.g. a company-scoped product picker)
    // do we restrict to that company's active selection in company_products.
    if (query.company_id) {
      queryBuilder.innerJoin(
        'products.company_products',
        'cp',
        'cp.company_id = :cpCompanyId AND cp.status = :cpStatus AND cp.deleted_at IS NULL',
        { cpCompanyId: query.company_id, cpStatus: 'active' },
      );
    }

    query.sort_by = 'products.id';

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
      .createQueryBuilder(ProductOrmEntity, 'products')
      .leftJoinAndSelect('products.product_type', 'product_type')
      .leftJoinAndSelect('products.unit', 'unit');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['products.name', 'products.description'],
      dateColumn: '',
      filterByColumns: ['products.product_type_id', 'products.status'],
    };
  }

  async findOne(
    id: ProductId,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductEntity>> {
    const item = await findOneOrFail(manager, ProductOrmEntity, {
      id: id.value,
    });

    // Load product type relation if needed
    const itemWithRelation = await manager.findOne(ProductOrmEntity, {
      where: { id: id.value },
      relations: ['product_type', 'unit'],
    });

    return this._dataAccessMapper.toEntity(itemWithRelation || item);
  }
}
