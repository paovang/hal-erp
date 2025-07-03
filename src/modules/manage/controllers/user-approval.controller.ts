import { Body, Controller, Inject, Post } from '@nestjs/common';
import { USER_APPROVAL_APPLICATION_SERVICE } from '../application/constants/inject-key.const';
import { TRANSFORM_RESULT_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransformResultService } from '@src/common/application/interfaces/transform-result-service.interface';
import { UserApprovalDataMapper } from '../application/mappers/user-approval.mapper';
import { IUserApprovalServiceInterface } from '../domain/ports/input/user-approval-domain-service,interface';
import { CreateUserApprovalDto } from '../application/dto/create/userApproval/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalResponse } from '../application/dto/response/user-approval.response';

@Controller('user_approvals')
export class UserApprovalController {
  constructor(
    @Inject(USER_APPROVAL_APPLICATION_SERVICE)
    private readonly _userApprovalService: IUserApprovalServiceInterface,
    @Inject(TRANSFORM_RESULT_SERVICE)
    private readonly _transformResultService: ITransformResultService,
    private readonly _dataMapper: UserApprovalDataMapper,
  ) {}

  @Post('')
  async create(
    @Body() dto: CreateUserApprovalDto,
  ): Promise<ResponseResult<UserApprovalResponse>> {
    const result = await this._userApprovalService.create(dto);

    return this._transformResultService.execute(
      this._dataMapper.toResponse.bind(this._dataMapper),
      result,
    );
  }
}
