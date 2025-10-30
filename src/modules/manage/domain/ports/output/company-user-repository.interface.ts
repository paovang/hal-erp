import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyUserEntity } from '../../entities/company-user.entity';
import { EntityManager } from 'typeorm';
import { CompanyUserQueryDto } from '@src/modules/manage/application/dto/query/company-user-query.dto';

export interface IWriteCompanyUserRepository {
  create(
    entity: CompanyUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;
}

export interface IReadCompanyUserRepository {
  findAll(
    query: CompanyUserQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;
}
