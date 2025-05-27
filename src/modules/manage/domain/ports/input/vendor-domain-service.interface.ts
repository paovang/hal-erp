import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateVendorDto } from '@src/modules/manage/application/dto/create/vendor/create.dto';
import { EntityManager } from 'typeorm';
import { VendorEntity } from '../../entities/vendor.entity';
import { VendorQueryDto } from '@src/modules/manage/application/dto/query/vendor-query.dto';
import { UpdateVendorDto } from '@src/modules/manage/application/dto/create/vendor/update.dto';

export interface IVendorServiceInterface {
  create(
    dto: CreateVendorDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorEntity>>;

  getAll(
    dto: VendorQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorEntity>>;

  update(
    id: number,
    dto: UpdateVendorDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<VendorEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
