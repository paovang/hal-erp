import { Inject, Injectable } from '@nestjs/common';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowQueryDto } from '@src/modules/manage/application/dto/query/approval-workflow.dto';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { IReadApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowDataAccessMapper } from '../../mappers/approval-workflow.mapper';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';
import {
  selectApprovalWorkflowSteps,
  selectDepartments,
  selectDocumentTypes,
  selectUsers,
} from '@src/common/constants/select-field';

@Injectable()
export class ReadApprovalWorkflowRepository
  implements IReadApprovalWorkflowRepository
{
  constructor(
    private readonly _dataAccessMapper: ApprovalWorkflowDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}

  async findAll(
    query: ApprovalWorkflowQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    const queryBuilder = await this.createBaseQuery(manager);
    query.sort_by = 'approval_workflows.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager) {
    const selectFields = [
      ...selectApprovalWorkflowSteps,
      ...selectDocumentTypes,
      ...selectDepartments,
      ...selectUsers,
    ];
    return manager
      .createQueryBuilder(ApprovalWorkflowOrmEntity, 'approval_workflows')
      .leftJoin('approval_workflows.document_types', 'document_types')
      .leftJoin(
        'approval_workflows.approval_workflow_steps',
        'approval_workflow_steps',
      )
      .leftJoin('approval_workflow_steps.departments', 'departments')
      .leftJoin('approval_workflow_steps.users', 'users')
      .addSelect(selectFields);
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: ['approval_workflows.name', 'document_types.name'],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: ApprovalWorkflowId,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('approval_workflows.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
