import { Injectable } from '@nestjs/common';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { OrmEntityMethod } from '@src/common/utils/orm-entity-method.enum';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowDataAccessMapper } from '../../mappers/approval-workflow.mapper';

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
}
