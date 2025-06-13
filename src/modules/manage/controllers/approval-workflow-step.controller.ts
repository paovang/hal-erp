import { Body, Controller, Inject, Param, Post } from '@nestjs/common';
import { APPROVAL_WORKFLOW_STEP_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { ApprovalWorkflowStepDataMapper } from '../application/mappers/approval-workflow-step.mapper';
import { IApprovalWorkflowStepServiceInterface } from '../domain/ports/input/approval-workflow-domain-service.interface';
import { CreateApprovalWorkflowStepDto } from '../application/dto/create/approvalWorkflowStep/create.dto';
import { ApprovalWorkflowStepResponse } from '../application/dto/response/approval-workflow-step.response';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

@Controller('approval-workflow-steps')
export class ApprovalWorkflowStepController {
  constructor(
    @Inject(APPROVAL_WORKFLOW_STEP_APPLICATION_SERVICE)
    private readonly _approvalWorkflowStepService: IApprovalWorkflowStepServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: ApprovalWorkflowStepDataMapper,
  ) {}

  @Post('/:id')
  async create(
    @Param('id') id: number,
    @Body() dto: CreateApprovalWorkflowStepDto,
  ): Promise<ResponseResult<ApprovalWorkflowStepResponse>> {
    const result = await this._approvalWorkflowStepService.create(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
