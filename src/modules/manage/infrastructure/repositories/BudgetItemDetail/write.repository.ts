import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BudgetItemDetailEntity } from '@src/modules/manage/domain/entities/budget-item-detail.entity';
import { EntityManager, UpdateResult } from 'typeorm';
import { BudgetItemDetailDataAccessMapper } from '../../mappers/budget-item-detail.mapper';
import { IWriteBudgetItemDetailRepository } from '@src/modules/manage/domain/ports/output/budget-item-detail-repository.interface';
import { BudgetItemDetailId } from '@src/modules/manage/domain/value-objects/budget-item-detail-rule-id.vo';
import { BudgetItemDetailOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item-detail.orm';

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

  async delete(id: BudgetItemDetailId, manager: EntityManager): Promise<void> {
    try {
      const deletedOrmEntity: UpdateResult = await manager.softDelete(
        BudgetItemDetailOrmEntity,
        id.value,
      );
      if (deletedOrmEntity.affected === 0) {
        // throw new UserDomainException('users.not_found', HttpStatus.NOT_FOUND);
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
