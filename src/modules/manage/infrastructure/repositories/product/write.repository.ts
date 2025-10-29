import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductEntity } from '@src/modules/manage/domain/entities/product.entity';
import { IWriteProductRepository } from '@src/modules/manage/domain/ports/output/product-repository.interface';
import { EntityManager } from 'typeorm';
import { ProductDataAccessMapper } from '../../mappers/product.mapper';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';
import { ProductId } from '@src/modules/manage/domain/value-objects/product-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteProductRepository implements IWriteProductRepository {
  constructor(private readonly _dataAccessMapper: ProductDataAccessMapper) {}

  async create(
    entity: ProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: ProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ProductEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(ProductOrmEntity, entity.getId().value, OrmEntity);

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ProductId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(ProductOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}