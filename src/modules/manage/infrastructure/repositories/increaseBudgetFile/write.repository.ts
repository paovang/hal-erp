import { Injectable } from '@nestjs/common';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { IWriteIncreaseBudgetFileRepository } from '@src/modules/manage/domain/ports/output/increase-budget-file-repository.interface';
import { IncreaseBudgetFileDataAccessMapper } from '../../mappers/increase-budget-file.mapper';
import { IncreaseBudgetFileEntity } from '@src/modules/manage/domain/entities/increase-budget-file.entity';

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
}
