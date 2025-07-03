import { Body, Controller, Inject, Param, Post, Put } from '@nestjs/common';
import { USER_APPROVAL_STEP_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IUserApprovalStepServiceInterface } from '../domain/ports/input/user-approval-step-domain-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { UserApprovalStepDataMapper } from '../application/mappers/user-approval-step.mapper';
import { ApprovalDto } from '../application/dto/create/userApprovalStep/update-statue.dto';
import { UserApprovalStepResponse } from '../application/dto/response/user-approval-step.response';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

@Controller()
export class UserApprovalStepController {
  constructor(
    @Inject(USER_APPROVAL_STEP_APPLICATION_SERVICE)
    private readonly _userApprovalService: IUserApprovalStepServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: UserApprovalStepDataMapper,
  ) {}

  @Put('approve/:id')
  async update(
    @Param('id') id: number,
    @Body() dto: ApprovalDto,
  ): Promise<ResponseResult<UserApprovalStepResponse>> {
    const result = await this._userApprovalService.update(id, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }

  // อนุมัติ step ปัจจุบัน
  @Post('approve-step/:stepId')
  async approveStep(
    @Param('stepId') stepId: number,
    @Body() dto: ApprovalDto,
  ): Promise<ResponseResult<UserApprovalStepResponse>> {
    // สมมติว่า req.user.id คือ approverId
    const result = await this._userApprovalService.create(stepId, dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
