import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCompanyUserDto } from '@src/modules/manage/application/dto/create/companyUser/create.dto';
import { EntityManager } from 'typeorm';
import { CompanyUserEntity } from '../../entities/company-user.entity';
import { CompanyUserQueryDto } from '@src/modules/manage/application/dto/query/company-user-query.dto';
import { UpdateCompanyUserDto } from '@src/modules/manage/application/dto/create/companyUser/update.dto';

export interface ICompanyUserServiceInterface {
  create(
    body: CreateCompanyUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;

  update(
    id: number,
    body: UpdateCompanyUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;

  getAll(
    dto: CompanyUserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
