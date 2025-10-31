import { EntityManager } from 'typeorm';
import { VendorProductEntity } from '../../entities/vendor-product.entity';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { VendorProductQueryDto } from '@src/modules/manage/application/dto/query/vendor-product-query.dto';
import { VendorProductId } from '../../value-objects/vendor-product-id.vo';

export interface IReadVendorProductRepository {
  findAll(
    query: VendorProductQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>>;

  findOne(
    id: VendorProductId,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>>;
}

export interface IWriteVendorProductRepository {
  create(
    entity: VendorProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>>;

  update(
    entity: VendorProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>>;

  delete(id: VendorProductId, manager: EntityManager): Promise<void>;
}