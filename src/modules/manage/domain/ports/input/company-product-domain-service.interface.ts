import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { CompanyProductEntity } from '../../entities/company-product.entity';
import { CreateCompanyProductDto } from '@src/modules/manage/application/dto/create/company-product/create.dto';
import { CompanyProductQueryDto } from '@src/modules/manage/application/dto/query/company-product-query.dto';
import { UpdateCompanyProductDto } from '@src/modules/manage/application/dto/create/company-product/update.dto';

export interface ICompanyProductServiceInterface {
  getAll(
    dto: CompanyProductQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>>;

  create(
    dto: CreateCompanyProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>>;

  update(
    id: number,
    dto: UpdateCompanyProductDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
