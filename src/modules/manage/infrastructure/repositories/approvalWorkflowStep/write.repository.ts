import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowStepEntity } from '@src/modules/manage/domain/entities/approval-workflow-step.entity';
import { IWriteApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { ApprovalWorkflowStepDataAccessMapper } from '../../mappers/approval-workflow-step.mapper';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ApprovalWorkflowStepId } from '@src/modules/manage/domain/value-objects/approval-workflow-step-id.vo';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@Injectable()
export class WriteApprovalWorkflowStepRepository
  implements IWriteApprovalWorkflowStepRepository
{
  constructor(
    private readonly _dataAccessMapper: ApprovalWorkflowStepDataAccessMapper,
  ) {}
  async create(
    entity: ApprovalWorkflowStepEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async delete(
    id: ApprovalWorkflowStepId,
    manager: EntityManager,
  ): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        ApprovalWorkflowStepOrmEntity,
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

  async update(
    entity: ApprovalWorkflowStepEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        ApprovalWorkflowStepOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async orderBy(
    entity: ApprovalWorkflowStepEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntityOrderBy(entity);

    try {
      await manager.update(
        ApprovalWorkflowStepOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }
}
