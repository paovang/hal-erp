import { HttpStatus, Injectable } from '@nestjs/common';
import { IWriteBudgetApprovalRuleRepository } from '@src/modules/manage/domain/ports/output/budget-approval-rule.interface';
import { BudgetApprovalRuleDataAccessMapper } from '../../mappers/budget-approval-rule.mapper';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetApprovalRuleEntity } from '@src/modules/manage/domain/entities/budget-approval-rule.entity';
import { EntityManager, UpdateResult } from 'typeorm';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { BudgetApprovalRuleId } from '@src/modules/manage/domain/value-objects/budget-approval-rule-id.vo';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';

@Injectable()
export class WriteBudgetApprovalRuleRepository
  implements IWriteBudgetApprovalRuleRepository
{
  constructor(
    private readonly _dataAccessMapper: BudgetApprovalRuleDataAccessMapper,
  ) {}
  async create(
    entity: BudgetApprovalRuleEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: BudgetApprovalRuleEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    const id = entity.getId().value;
    const ormEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(BudgetApprovalRuleOrmEntity, id, ormEntity);

      const updated = await manager.findOneByOrFail(
        BudgetApprovalRuleOrmEntity,
        {
          id,
        },
      );

      return this._dataAccessMapper.toEntity(updated);
    } catch (error) {
      throw new ManageDomainException(
        'errors.internal_service_error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(
    id: BudgetApprovalRuleId,
    manager: EntityManager,
  ): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        BudgetApprovalRuleOrmEntity,
        id.value,
      );
      if (deletedUserOrmEntity.affected === 0) {
        // throw new UserDomainException('users.not_found', HttpStatus.NOT_FOUND);
      }
      return;
    } catch (error) {
      throw error;
    }
  }
}
