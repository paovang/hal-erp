import { Injectable } from '@nestjs/common';
import { IWriteIncreaseBudgetDetailRepository } from '@src/modules/manage/domain/ports/output/increase-budget-detail-repository.interface';
import { IncreaseBudgetDetailDataAccessMapper } from '../../mappers/increase-budget-detail.mapper';
import { IncreaseBudgetDetailEntity } from '@src/modules/manage/domain/entities/increase-budget-detail.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteIncreaseBudgetDetailRepository
  implements IWriteIncreaseBudgetDetailRepository
{
  constructor(
    private readonly _dataAccessMapper: IncreaseBudgetDetailDataAccessMapper,
  ) {}

  async create(
    entity: IncreaseBudgetDetailEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }
}
