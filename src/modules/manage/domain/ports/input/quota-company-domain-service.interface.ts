import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CreateUnitDto } from '@src/modules/manage/application/dto/create/unit/create.dto';
import { EntityManager } from 'typeorm';
import { UnitEntity } from '../../entities/unit.entity';
import { QuotaCompanyQueryDto } from '@src/modules/manage/application/dto/query/quota-company.dto';
import { UpdateUnitDto } from '@src/modules/manage/application/dto/create/unit/update.dto';
import { QuotaCompanyEntity } from '../../entities/quota-company.entity';
import { CreateQuotaCompanyDto } from '@src/modules/manage/application/dto/create/QuotaCompany/create.dto';
import { UpdateQuotaCompanyDto } from '@src/modules/manage/application/dto/create/QuotaCompany/update.dto';

export interface IQuotaCompanyServiceInterface {
  getAll(
    dto: QuotaCompanyQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>>;

  getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>>;

  create(
    dto: CreateQuotaCompanyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>>;

  update(
    id: number,
    dto: UpdateQuotaCompanyDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>>;

  delete(id: number, manager?: EntityManager): Promise<void>;
}
