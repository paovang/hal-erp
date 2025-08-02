import { Inject, Injectable } from '@nestjs/common';
import { PAGINATION_SERVICE } from '@src/common/constants/inject-key.const';
import {
  FilterOptions,
  IPaginationService,
  ResponseResult,
} from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowStepQueryDto } from '@src/modules/manage/application/dto/query/approval-workflow-step.dto';
import { ApprovalWorkflowStepEntity } from '@src/modules/manage/domain/entities/approval-workflow-step.entity';
import { IReadApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowStepDataAccessMapper } from '../../mappers/approval-workflow-step.mapper';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { ApprovalWorkflowStepId } from '@src/modules/manage/domain/value-objects/approval-workflow-step-id.vo';
import {
  selectDepartments,
  selectUsers,
} from '@src/common/constants/select-field';

@Injectable()
export class ReadApprovalWorkflowStepRepository
  implements IReadApprovalWorkflowStepRepository
{
  constructor(
    private readonly _dataAccessMapper: ApprovalWorkflowStepDataAccessMapper,
    @Inject(PAGINATION_SERVICE)
    private readonly _paginationService: IPaginationService,
  ) {}
  async findAll(
    id: number,
    query: ApprovalWorkflowStepQueryDto,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    const queryBuilder = await this.createBaseQuery(manager, id);
    query.sort_by = 'approval_workflow_steps.id';

    const data = await this._paginationService.paginate(
      queryBuilder,
      query,
      this._dataAccessMapper.toEntity.bind(this._dataAccessMapper),
      this.getFilterOptions(),
    );
    return data;
  }

  private createBaseQuery(manager: EntityManager, id?: number) {
    const selectFields = [...selectDepartments, ...selectUsers];
    const qb = manager
      .createQueryBuilder(
        ApprovalWorkflowStepOrmEntity,
        'approval_workflow_steps',
      )
      .leftJoin('approval_workflow_steps.departments', 'departments')
      .leftJoin('approval_workflow_steps.users', 'users')
      .addSelect(selectFields);

    if (id) {
      qb.where('approval_workflow_steps.approval_workflow_id = :id', { id });
    }

    return qb;
  }

  private getFilterOptions(): FilterOptions {
    return {
      searchColumns: [
        'approval_workflow_steps.step_name',
        'departments.name',
        'departments.code',
      ],
      dateColumn: '',
      filterByColumns: [],
    };
  }

  async findOne(
    id: ApprovalWorkflowStepId,
    manager: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    const item = await this.createBaseQuery(manager)
      .where('approval_workflow_steps.id = :id', { id: id.value })
      .getOneOrFail();

    return this._dataAccessMapper.toEntity(item);
  }
}
