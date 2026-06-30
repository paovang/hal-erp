import { EntityManager } from 'typeorm';
import { CompanyVendorEntity } from '../../entities/company-vendor.entity';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyVendorQueryDto } from '@src/modules/manage/application/dto/query/company-vendor-query.dto';
import { CompanyVendorId } from '../../value-objects/company-vendor-id.vo';

export interface IReadCompanyVendorRepository {
  findAll(
    query: CompanyVendorQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>>;

  findOne(
    id: CompanyVendorId,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>>;

  /**
   * Returns the active (non-deleted, status = active) onboarding record for a
   * given company+vendor pair, or null when the vendor is not onboarded/enabled
   * for that company. Used to gate vendor selection on company documents.
   */
  findActiveByCompanyAndVendor(
    companyId: number,
    vendorId: number,
    manager: EntityManager,
  ): Promise<CompanyVendorEntity | null>;
}

export interface IWriteCompanyVendorRepository {
  create(
    entity: CompanyVendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>>;

  update(
    entity: CompanyVendorEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyVendorEntity>>;

  delete(id: CompanyVendorId, manager: EntityManager): Promise<void>;
}
