import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PositionEntity } from '@src/modules/manage/domain/entities/position.entity';
import { IWritePositionRepository } from '@src/modules/manage/domain/ports/output/position-repository.interface';
import { EntityManager } from 'typeorm';
import { PositionDataAccessMapper } from '../../mappers/position.mapper';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { PositionId } from '@src/modules/manage/domain/value-objects/position-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WritePositionRepository implements IWritePositionRepository {
  constructor(private readonly _dataAccessMapper: PositionDataAccessMapper) {}

  async create(
    entity: PositionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PositionEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: PositionEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<PositionEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(PositionOrmEntity, entity.getId().value, OrmEntity);

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: PositionId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(PositionOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
