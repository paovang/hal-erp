import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { VendorProductOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor-product.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorProductQueryDto } from '@src/modules/manage/application/dto/query/vendor-product-query.dto';
import { VendorProductEntity } from '@src/modules/manage/domain/entities/vendor-product.entity';
import { IReadVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { EntityManager, Repository } from 'typeorm';
import { VendorProductDataAccessMapper } from '../../mappers/vendor-product.mapper';
import { VendorProductId } from '@src/modules/manage/domain/value-objects/vendor-product-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';

@Injectable()
export class ReadVendorProductRepository implements IReadVendorProductRepository {
  constructor(
    @InjectRepository(VendorProductOrmEntity)
    private readonly _vendorProductOrm: Repository<VendorProductOrmEntity>,
    private readonly _dataAccessMapper: VendorProductDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    query: VendorProductQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'vendor_products.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    return manager.createQueryBuilder(VendorProductOrmEntity, 'vendor_products')
      .leftJoinAndSelect('vendor_products.vendors', 'vendor')
      .leftJoinAndSelect('vendor_products.products', 'product');
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['vendors.name', 'products.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: VendorProductId,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    const item = await manager.findOne(VendorProductOrmEntity, {
      where: { id: id.value },
      relations: ['vendors', 'products']
    });

    if (!item) {
      throw new Error('Vendor product not found');
    }

    return this._dataAccessMapper.toEntity(item);
  }
}