import { ApprovalDto } from '@src/modules/manage/application/dto/create/userApprovalStep/update-statue.dto';
import { UserApprovalStepEntity } from '../../entities/user-approval-step.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';

export interface IUserApprovalStepServiceInterface {
  sendOTP(id: number, manager?: EntityManager): Promise<UserApprovalStepEntity>;

  create(
    stepId: number,
    dto: ApprovalDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserApprovalStepEntity>>;
}
