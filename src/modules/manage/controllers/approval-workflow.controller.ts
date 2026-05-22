import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { APPROVAL_WORKFLOW_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { IApprovalWorkflowServiceInterface } from '../domain/ports/input/approval-workflow-service.interface';
import { ApprovalWorkflowDataMapper } from '../application/mappers/approval-workflow.mapper';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowResponse } from '../application/dto/response/approval-workflow.response';
import { CreateApprovalWorkflowDto } from '../application/dto/create/ApprovalWorkflow/create.dto';
import { ApprovalWorkflowQueryDto } from '../application/dto/query/approval-workflow.dto';
import { UpdateApprovalWorkflowDto } from '../application/dto/create/ApprovalWorkflow/update.dto';
import { ApproveDto } from '../application/dto/create/ApprovalWorkflow/approve.dto';
import { SendApprovalMailDto } from '../application/dto/create/ApprovalWorkflow/send-approval-mail.dto';
import { ApproveByTokenDto } from '../application/dto/create/ApprovalWorkflow/approve-by-token.dto';
import { Public } from '@core-system/auth';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('approval-workflows')
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

  @Get(':id')
  async getOne(
    @Param('id') id: number,
  ): Promise<ResponseResult<ApprovalWorkflowResponse>> {
    const result = await this._approvalWorkflowService.getOne(id);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateApprovalWorkflowDto,
  ): Promise<ResponseResult<ApprovalWorkflowResponse>> {
    const result = await this._approvalWorkflowService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Put('/approve/:id')
  async approve(
    @Param('id') id: number,
    @Body() dto: ApproveDto,
  ): Promise<ResponseResult<ApprovalWorkflowResponse>> {
    const result = await this._approvalWorkflowService.approve(id, dto);
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Post(':id/send-approval-mail')
  @ApiOperation({
    summary: 'Send an approval-request email to the selected approver',
  })
  @ApiBody({ type: SendApprovalMailDto })
  async sendApprovalMail(
    @Param('id') id: number,
    @Body() dto: SendApprovalMailDto,
  ): Promise<ResponseResult<ApprovalWorkflowResponse>> {
    const result = await this._approvalWorkflowService.sendApprovalMail(
      id,
      dto,
    );
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Public()
  @Post('approve-by-token')
  @ApiOperation({
    summary: 'Approve an approval workflow using an emailed token',
  })
  @ApiBody({ type: ApproveByTokenDto })
  async approveByToken(
    @Body() dto: ApproveByTokenDto,
  ): Promise<ResponseResult<ApprovalWorkflowResponse>> {
    const result = await this._approvalWorkflowService.approveByToken(dto);
    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return await this._approvalWorkflowService.delete(id);
  }
}
