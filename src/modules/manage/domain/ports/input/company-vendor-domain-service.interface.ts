import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { CompanyVendorEntity } from '../../entities/company-vendor.entity';
import { CreateCompanyVendorDto } from '@src/modules/manage/application/dto/create/company-vendor/create.dto';
import { UpdateCompanyVendorDto } from '@src/modules/manage/application/dto/create/company-vendor/update.dto';
import { CompanyVendorQueryDto } from '@src/modules/manage/application/dto/query/company-vendor-query.dto';

export interface ICompanyVendorServiceInterface {
  getAll(
    dto: CompanyVendorQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>>;

  create(
    dto: CreateCompanyVendorDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>>;

  update(
    id: number,
    dto: UpdateCompanyVendorDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
