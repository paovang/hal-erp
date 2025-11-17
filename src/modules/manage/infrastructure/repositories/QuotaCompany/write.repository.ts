import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { IWriteQuotaCompanyRepository } from '@src/modules/manage/domain/ports/output/quota-company-repository.interface';
import { EntityManager } from 'typeorm';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { QuotaCompanyDataAccessMapper } from '../../mappers/quota-company.mapper';
import { QuotaCompanyEntity } from '@src/modules/manage/domain/entities/quota-company.entity';
import { QuotaCompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/quota-company.orm';
import { QuotaCompanyId } from '@src/modules/manage/domain/value-objects/quota-company-id.vo';

@Injectable()
export class WriteQuotaRepository implements IWriteQuotaCompanyRepository {
  constructor(
    private readonly _dataAccessMapper: QuotaCompanyDataAccessMapper,
  ) {}

  async create(
    entity: QuotaCompanyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    console.log('object', entity);
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: QuotaCompanyEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        QuotaCompanyOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: QuotaCompanyId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(QuotaCompanyOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
