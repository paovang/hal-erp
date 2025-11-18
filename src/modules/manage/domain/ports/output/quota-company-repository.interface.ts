import { EntityManager } from 'typeorm';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { QuotaCompanyEntity } from '../../entities/quota-company.entity';
import { QuotaCompanyId } from '../../value-objects/quota-company-id.vo';
import { QuotaCompanyQueryDto } from '@src/modules/manage/application/dto/query/quota-company.dto';

export interface IWriteQuotaCompanyRepository {
  create(
    entity: QuotaCompanyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>>;

  update(
    entity: QuotaCompanyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>>;

  delete(id: QuotaCompanyId, manager: EntityManager): Promise<void>;
}

export interface IReadQuotaCompanyRepository {
  findAll(
    query: QuotaCompanyQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>>;

  findOne(
    id: QuotaCompanyId,
    manager: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>>;
}
