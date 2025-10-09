import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { IWriteBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { EntityManager, UpdateResult } from 'typeorm';
import { BudgetItemDataAccessMapper } from '../../mappers/budget-item.mapper';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { BudgetItemId } from '@src/modules/manage/domain/value-objects/budget-item-id.vo';

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

  async update(
    entity: BudgetItemEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    const id = entity.getId().value;
    const ormEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(BudgetItemOrmEntity, id, ormEntity);

      const updated = await manager.findOneByOrFail(BudgetItemOrmEntity, {
        id,
      });

      return this._dataAccessMapper.toEntity(updated);
    } catch (error) {
      throw new ManageDomainException(
        'errors.internal_service_error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: BudgetItemId, manager: EntityManager): Promise<void> {
    try {
      const deletedOrmEntity: UpdateResult = await manager.softDelete(
        BudgetItemOrmEntity,
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
