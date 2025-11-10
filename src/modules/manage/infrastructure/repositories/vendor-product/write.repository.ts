import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorProductEntity } from '@src/modules/manage/domain/entities/vendor-product.entity';
import { IWriteVendorProductRepository } from '@src/modules/manage/domain/ports/output/vendor-product-repository.interface';
import { EntityManager } from 'typeorm';
import { VendorProductDataAccessMapper } from '../../mappers/vendor-product.mapper';
import { VendorProductOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor-product.orm';
import { VendorProductId } from '@src/modules/manage/domain/value-objects/vendor-product-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteVendorProductRepository
  implements IWriteVendorProductRepository
{
  constructor(
    private readonly _dataAccessMapper: VendorProductDataAccessMapper,
  ) {}

  async create(
    entity: VendorProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: VendorProductEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VendorProductEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        VendorProductOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: VendorProductId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(VendorProductOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
