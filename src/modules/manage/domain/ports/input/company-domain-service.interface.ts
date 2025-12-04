import { EntityManager } from 'typeorm';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { CreateCompanyDto } from '@src/modules/manage/application/dto/create/company/create.dto';
import { UpdateCompanyDto } from '@src/modules/manage/application/dto/create/company/update.dto';
import { CompanyQueryDto } from '@src/modules/manage/application/dto/query/company-query.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ReportCompanyInterface } from '@src/common/application/interfaces/report-company.intergace';

export interface ICompanyServiceInterface {
  getAll(
    dto: CompanyQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>>;

  getReport(
    manager?: EntityManager,
  ): Promise<ResponseResult<ReportCompanyInterface>>;

  getReportReceipt(
    query: CompanyQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>>;

  create(
    dto: CreateCompanyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>>;

  update(
    id: number,
    dto: UpdateCompanyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>>;

  getOneReport(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<any>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
