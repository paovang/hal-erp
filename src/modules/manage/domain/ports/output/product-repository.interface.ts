import { EntityManager } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductQueryDto } from '@src/modules/manage/application/dto/query/product-query.dto';
import { ProductId } from '../../value-objects/product-id.vo';

export interface IReadProductRepository {
  findAll(
    query: ProductQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductEntity>>;

  findOne(
    id: ProductId,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductEntity>>;
}

export interface IWriteProductRepository {
  create(
    entity: ProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductEntity>>;

  update(
    entity: ProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductEntity>>;

  delete(id: ProductId, manager: EntityManager): Promise<void>;
}