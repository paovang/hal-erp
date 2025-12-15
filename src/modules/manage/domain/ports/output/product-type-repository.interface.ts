import { EntityManager } from 'typeorm';
import { ProductTypeEntity } from '../../entities/product-type.entity';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductTypeQueryDto } from '@src/modules/manage/application/dto/query/product-type-query.dto';
import { ProductTypeId } from '../../value-objects/product-type-id.vo';

export interface IReadProductTypeRepository {
  findAll(
    query: ProductTypeQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>>;

  findOne(
    id: ProductTypeId,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>>;
}

export interface IWriteProductTypeRepository {
  create(
    entity: ProductTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>>;

  update(
    entity: ProductTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>>;

  delete(id: ProductTypeId, manager: EntityManager): Promise<void>;
}
