import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCompanyUserDto } from '@src/modules/manage/application/dto/create/companyUser/create.dto';
import { EntityManager } from 'typeorm';
import { CompanyUserEntity } from '../../entities/company-user.entity';
import { CompanyUserQueryDto } from '@src/modules/manage/application/dto/query/company-user-query.dto';

export interface ICompanyUserServiceInterface {
  create(
    body: CreateCompanyUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;

  getAll(
    dto: CompanyUserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;
}
