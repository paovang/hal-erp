import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductTypeEntity } from '@src/modules/manage/domain/entities/product-type.entity';
import { IWriteProductTypeRepository } from '@src/modules/manage/domain/ports/output/product-type-repository.interface';
import { EntityManager } from 'typeorm';
import { ProductTypeDataAccessMapper } from '../../mappers/product-type.mapper';
import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { ProductTypeId } from '@src/modules/manage/domain/value-objects/product-type-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteProductTypeRepository implements IWriteProductTypeRepository {
  constructor(
    private readonly _dataAccessMapper: ProductTypeDataAccessMapper,
  ) {}

  async create(
    entity: ProductTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: ProductTypeEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductTypeEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        ProductTypeOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ProductTypeId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(ProductTypeOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
