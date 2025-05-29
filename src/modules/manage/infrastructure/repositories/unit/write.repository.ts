import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UnitEntity } from '@src/modules/manage/domain/entities/unit.entity';
import { IWriteUnitRepository } from '@src/modules/manage/domain/ports/output/unit-repository.interface';
import { EntityManager } from 'typeorm';
import { UnitDataAccessMapper } from '../../mappers/unit.mapper';
import { UnitOrmEntity } from '@src/common/infrastructure/database/typeorm/unit.orm';
import { UnitId } from '@src/modules/manage/domain/value-objects/unit-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteUnitRepository implements IWriteUnitRepository {
  constructor(private readonly _dataAccessMapper: UnitDataAccessMapper) {}

  async create(
    entity: UnitEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UnitEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: UnitEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<UnitEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(UnitOrmEntity, entity.getId().value, OrmEntity);

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: UnitId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(UnitOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
