import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyUserEntity } from '../../entities/company-user.entity';
import { EntityManager } from 'typeorm';
import { CompanyUserQueryDto } from '@src/modules/manage/application/dto/query/company-user-query.dto';
import { CompanyUserId } from '../../value-objects/company-user-id.vo';

export interface IWriteCompanyUserRepository {
  create(
    entity: CompanyUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;

  delete(id: CompanyUserId, manager: EntityManager): Promise<void>;
}

export interface IReadCompanyUserRepository {
  findAll(
    query: CompanyUserQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;

  findOne(
    id: CompanyUserId,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;
}
