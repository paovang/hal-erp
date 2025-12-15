import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ProductTypeEntity } from '../../entities/product-type.entity';
import { CreateProductTypeDto } from '@src/modules/manage/application/dto/create/product-type/create.dto';
import { ProductTypeQueryDto } from '@src/modules/manage/application/dto/query/product-type-query.dto';
import { UpdateProductTypeDto } from '@src/modules/manage/application/dto/create/product-type/update.dto';

export interface IProductTypeServiceInterface {
  getAll(
    dto: ProductTypeQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>>;

  create(
    dto: CreateProductTypeDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>>;

  update(
    id: number,
    dto: UpdateProductTypeDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
