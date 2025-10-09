import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import { IWriteBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { BudgetAccountDataAccessMapper } from '../../mappers/budget-account.mapper';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { BudgetAccountId } from '@src/modules/manage/domain/value-objects/budget-account-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@Injectable()
export class WriteBudgetAccountRepository
  implements IWriteBudgetAccountRepository
{
  constructor(
    private readonly _dataAccessMapper: BudgetAccountDataAccessMapper,
  ) {}

  async create(
    entity: BudgetAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: BudgetAccountEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        BudgetAccountOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: BudgetAccountId, manager: EntityManager): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        BudgetAccountOrmEntity,
        id.value,
      );
      if (deletedUserOrmEntity.affected === 0) {
        throw new ManageDomainException(
          'error.not_found',
          HttpStatus.NOT_FOUND,
        );
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
