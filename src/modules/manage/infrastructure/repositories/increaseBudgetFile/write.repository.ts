import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { IWriteIncreaseBudgetFileRepository } from '@src/modules/manage/domain/ports/output/increase-budget-file-repository.interface';
import { IncreaseBudgetFileDataAccessMapper } from '../../mappers/increase-budget-file.mapper';
import { IncreaseBudgetFileEntity } from '@src/modules/manage/domain/entities/increase-budget-file.entity';
import { IncreaseBudgetFileOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget-file.orm';
import { IncreaseBudgetFileId } from '@src/modules/manage/domain/value-objects/increase-budget-file-id.vo';

@Injectable()
export class WriteIncreaseBudgetFileRepository
  implements IWriteIncreaseBudgetFileRepository
{
  constructor(
    private readonly _dataAccessMapper: IncreaseBudgetFileDataAccessMapper,
  ) {}

  async create(
    entity: IncreaseBudgetFileEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetFileEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: IncreaseBudgetFileEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetFileEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        IncreaseBudgetFileOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(
    id: IncreaseBudgetFileId,
    manager: EntityManager,
  ): Promise<void> {
    try {
      await manager.softDelete(IncreaseBudgetFileOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
