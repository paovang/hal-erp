import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { ProductEntity } from '../../entities/product.entity';
import { CreateProductDto } from '@src/modules/manage/application/dto/create/product/create.dto';
import { ProductQueryDto } from '@src/modules/manage/application/dto/query/product-query.dto';
import { UpdateProductDto } from '@src/modules/manage/application/dto/create/product/update.dto';

export interface IProductServiceInterface {
  getAll(
    dto: ProductQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductEntity>>;

  create(
    dto: CreateProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductEntity>>;

  update(
    id: number,
    dto: UpdateProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProductEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
