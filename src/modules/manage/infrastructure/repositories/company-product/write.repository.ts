import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyProductEntity } from '@src/modules/manage/domain/entities/company-product.entity';
import { IWriteCompanyProductRepository } from '@src/modules/manage/domain/ports/output/company-product-repository.interface';
import { EntityManager } from 'typeorm';
import { CompanyProductDataAccessMapper } from '../../mappers/company-product.mapper';
import { CompanyProductOrmEntity } from '@src/common/infrastructure/database/typeorm/company-product.orm';
import { CompanyProductId } from '@src/modules/manage/domain/value-objects/company-product-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteCompanyProductRepository
  implements IWriteCompanyProductRepository
{
  constructor(
    private readonly _dataAccessMapper: CompanyProductDataAccessMapper,
  ) {}

  async create(
    entity: CompanyProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: CompanyProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        CompanyProductOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: CompanyProductId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(CompanyProductOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
