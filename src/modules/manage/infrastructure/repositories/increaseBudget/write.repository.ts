import { Injectable } from '@nestjs/common';
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { IncreaseBudgetDataAccessMapper } from '../../mappers/increase-budget.mapper';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { IncreaseBudgetEntity } from '@src/modules/manage/domain/entities/increase-budget.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';

@Injectable()
export class WriteIncreaseBudgetRepository
  implements IWriteIncreaseBudgetRepository
{
  constructor(
    private readonly _dataAccessMapper: IncreaseBudgetDataAccessMapper,
  ) {}

  async create(
    entity: IncreaseBudgetEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: IncreaseBudgetEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        IncreaseBudgetOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: IncreaseBudgetId, manager: EntityManager): Promise<void> {
    try {
      await manager.softDelete(IncreaseBudgetOrmEntity, id.value);
    } catch (error) {
      throw error;
    }
  }
}
