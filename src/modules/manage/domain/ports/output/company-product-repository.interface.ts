import { EntityManager } from 'typeorm';
import { CompanyProductEntity } from '../../entities/company-product.entity';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyProductQueryDto } from '@src/modules/manage/application/dto/query/company-product-query.dto';
import { CompanyProductId } from '../../value-objects/company-product-id.vo';

export interface IReadCompanyProductRepository {
  findAll(
    query: CompanyProductQueryDto,
    manager: EntityManager,
    roles?: string[],
    company_id?: number,
  ): Promise<ResponseResult<CompanyProductEntity>>;

  findOne(
    id: CompanyProductId,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>>;
}

export interface IWriteCompanyProductRepository {
  create(
    entity: CompanyProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>>;

  update(
    entity: CompanyProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>>;

  delete(id: CompanyProductId, manager: EntityManager): Promise<void>;
}
