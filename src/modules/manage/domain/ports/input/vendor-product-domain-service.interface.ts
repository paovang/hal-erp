import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { VendorProductEntity } from '../../entities/vendor-product.entity';
import { CreateVendorProductDto } from '@src/modules/manage/application/dto/create/vendor-product/create.dto';
import { VendorProductQueryDto } from '@src/modules/manage/application/dto/query/vendor-product-query.dto';
import { UpdateVendorProductDto } from '@src/modules/manage/application/dto/create/vendor-product/update.dto';

export interface IVendorProductServiceInterface {
  getAll(
    dto: VendorProductQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>>;

  create(
    dto: CreateVendorProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>>;

  update(
    id: number,
    dto: UpdateVendorProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}