import { Injectable } from '@nestjs/common';
import { IWriteCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { CompanyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/company.mapper';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteCompanyRepository implements IWriteCompanyRepository {
  constructor(private readonly _dataAccessMapper: CompanyDataAccessMapper) {}

  async create(
    entity: CompanyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: CompanyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyEntity>> {
    const companyOrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        CompanyOrmEntity,
        entity.getId().value,
        companyOrmEntity,
      );

      return this._dataAccessMapper.toEntity(companyOrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: CompanyId, manager: EntityManager): Promise<void> {
    try {
      const deletedCompanyOrmEntity: UpdateResult = await manager.softDelete(
        CompanyOrmEntity,
        id.value,
      );
      if (deletedCompanyOrmEntity.affected === 0) {
        // throw new CompanyDomainException('companies.not_found', HttpStatus.NOT_FOUND);
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
