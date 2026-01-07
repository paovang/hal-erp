import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { USER_APPROVAL_STEP_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { IUserApprovalStepServiceInterface } from '../domain/ports/input/user-approval-step-domain-service.interface';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { UserApprovalStepDataMapper } from '../application/mappers/user-approval-step.mapper';
import { ApprovalDto } from '../application/dto/create/userApprovalStep/update-statue.dto';
import { UserApprovalStepResponse } from '../application/dto/response/user-approval-step.response';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CountItemDto } from '../application/dto/query/count-item.dto';
import { Public } from '@core-system/auth';
import { verifyHashData } from '@src/common/utils/server/hash-data.util';
import { ManageDomainException } from '../domain/exceptions/manage-domain.exception';

@Controller()
export class UserApprovalStepController {
  constructor(
    @Inject(USER_APPROVAL_STEP_APPLICATION_SERVICE)
    private readonly _userApprovalService: IUserApprovalStepServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: UserApprovalStepDataMapper,
  ) {}

  @Post('send-otp/:id')
  async sendOTP(@Param('id') id: number): Promise<any> {
    return await this._userApprovalService.sendOTP(id);
  }

  @Public()
  @Post('approve-by-token/:token')
  async verifyOTP(
    // @Query() token_dto: TokenDto,
    @Param('token') token: string,
    @Body() dto: ApprovalDto,
  ): Promise<ResponseResult<UserApprovalStepResponse>> {
    const verify = await verifyHashData(token);
    if (!verify) {
      throw new ManageDomainException(
        'errors.invalid_token',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log('verify', verify);

    const result = await this._userApprovalService.create(
      verify.step_id,
      dto,
      undefined,
      verify.user_id,
    );

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

  @Get('count')
  async count(
    @Query() query: CountItemDto,
  ): Promise<ResponseResult<{ amount: number }>> {
    const result = await this._userApprovalService.count(query);
    return { amount: result.amount };
  }
}
