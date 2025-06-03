import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { APPROVAL_WORKFLOW_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IApprovalWorkflowServiceInterface } from '../domain/ports/input/approval-workflow-service.interface';
import { ApprovalWorkflowDataMapper } from '../application/mappers/approval-workflow.mapper';
import { CreateApprovalWorkflowDto } from '../application/dto/create/ApprovalWorkflow/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowResponse } from '../application/dto/response/approval-workflow.response';
import { ApprovalWorkflowQueryDto } from '../application/dto/query/approval-workflow.dto';

@Controller('approval-workflows')
export class ApprovalWorkflowController {
  constructor(
    @Inject(APPROVAL_WORKFLOW_APPLICATION_SERVICE)
    private readonly _approvalWorkflowService: IApprovalWorkflowServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ApprovalWorkflowDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateApprovalWorkflowDto,
  ): Promise<ResponseResult<ApprovalWorkflowResponse>> {
    const result = await this._approvalWorkflowService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Get('')
  async getAll(
    @Query() dto: ApprovalWorkflowQueryDto,
  ): Promise<ResponseResult<ApprovalWorkflowResponse>> {
    const result = await this._approvalWorkflowService.getAll(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
