import { HttpStatus, Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { EntityManager, UpdateResult } from 'typeorm';
import { ApprovalWorkflowDataAccessMapper } from '../../mappers/approval-workflow.mapper';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';

@Injectable()
export class WriteApprovalWorkflowRepository
  implements IWriteApprovalWorkflowRepository
{
  constructor(
    private readonly _dataAccessMapper: ApprovalWorkflowDataAccessMapper,
  ) {}

  async create(
    entity: ApprovalWorkflowEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(
        this._dataAccessMapper.toOrmEntity(entity, OrmEntityMethod.CREATE),
      ),
    );
  }

  async update(
    entity: ApprovalWorkflowEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    const OrmEntity = this._dataAccessMapper.toOrmEntity(
      entity,
      OrmEntityMethod.UPDATE,
    );

    try {
      await manager.update(
        ApprovalWorkflowOrmEntity,
        entity.getId().value,
        OrmEntity,
      );

      return this._dataAccessMapper.toEntity(OrmEntity);
    } catch (error) {
      throw error;
    }
  }

  async delete(id: ApprovalWorkflowId, manager: EntityManager): Promise<void> {
    try {
      const deletedUserOrmEntity: UpdateResult = await manager.softDelete(
        ApprovalWorkflowOrmEntity,
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
