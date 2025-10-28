import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';
import { EntityManager } from 'typeorm';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';

export interface IReadCompanyRepository {
  findAll(
    query: CompanyQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>>;

  findOne(
    id: CompanyId,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>>;
}

export interface IWriteCompanyRepository {
  create(
    entity: CompanyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>>;

  update(
    entity: CompanyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>>;

  delete(id: CompanyId, manager: EntityManager): Promise<void>;
}