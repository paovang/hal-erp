import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { IWriteVatRepository } from '@src/modules/manage/domain/ports/output/vat-repository.interface';
import { VatDataAccessMapper } from '../../mappers/vat.mapper';
import { VatEntity } from '@src/modules/manage/domain/entities/vat.entity';
import { VatOrmEntity } from '@src/common/infrastructure/database/typeorm/vat.orm';
import { VatId } from '@src/modules/manage/domain/value-objects/vat-id.vo';

@Injectable()
export class WriteVatRepository implements IWriteVatRepository {
  constructor(private readonly _dataAccessMapper: VatDataAccessMapper) {}

  async create(
    entity: VatEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VatEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: VatEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<VatEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(VatOrmEntity, entity.getId().value, OrmEntity);

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: VatId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(VatOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
