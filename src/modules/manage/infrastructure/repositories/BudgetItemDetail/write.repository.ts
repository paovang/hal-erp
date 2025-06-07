import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BudgetItemDetailEntity } from '@src/modules/manage/domain/entities/budget-item-detail.entity';
import { EntityManager } from 'typeorm';
import { BudgetItemDetailDataAccessMapper } from '../../mappers/budget-item-detail.mapper';
import { IWriteBudgetItemDetailRepository } from '@src/modules/manage/domain/ports/output/budget-item-detail-repository.interface';

@Injectable()
export class WriteBudgetItemDetailRepository
  implements IWriteBudgetItemDetailRepository
{
  constructor(
    private readonly _dataAccessMapper: BudgetItemDetailDataAccessMapper,
  ) {}

  async create(
    entity: BudgetItemDetailEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemDetailEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }
}
