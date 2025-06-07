import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { IWriteBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { EntityManager } from 'typeorm';
import { BudgetItemDataAccessMapper } from '../../mappers/budget-item.mapper';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';

@Injectable()
export class WriteBudgetItemRepository implements IWriteBudgetItemRepository {
  constructor(private readonly _dataAccessMapper: BudgetItemDataAccessMapper) {}

  async create(
    entity: BudgetItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async updateColumns(
    entity: BudgetItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const budgetItemOrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        BudgetItemOrmEntity,
        entity.getId().value,
        budgetItemOrmEntity,
      );

      return this._dataAccessMapper.toEntity(budgetItemOrmEntity);
    } catch (error) {
      throw error;
    }
  }
}
