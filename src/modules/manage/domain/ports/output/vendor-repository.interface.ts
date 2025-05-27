import { EntityManager } from 'typeorm';
import { VendorEntity } from '../../entities/vendor.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorQueryDto } from '@src/modules/manage/application/dto/query/vendor-query.dto';
import { VendorId } from '../../value-objects/vendor-id.vo';

export interface IWriteVendorRepository {
  create(
    entity: VendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorEntity>>;

  update(
    entity: VendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorEntity>>;

  delete(id: VendorId, manager: EntityManager): Promise<void>;
}

export interface IReadVendorRepository {
  findAll(
    query: VendorQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorEntity>>;

  findOne(
    id: VendorId,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorEntity>>;
}
