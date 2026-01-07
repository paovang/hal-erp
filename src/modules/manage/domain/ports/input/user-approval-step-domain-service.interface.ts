import { ApprovalDto } from '@src/modules/manage/application/dto/create/userApprovalStep/update-statue.dto';
import { UserApprovalStepEntity } from '../../entities/user-approval-step.entity';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CountItemDto } from '@src/modules/manage/application/dto/query/count-item.dto';

export interface IUserApprovalStepServiceInterface {
  sendOTP(id: number, manager?: EntityManager): Promise<UserApprovalStepEntity>;

  create(
    stepId: number,
    dto: ApprovalDto,
    manager?: EntityManager,
    user_id?: number,
  ): Promise<ResponseResult<UserApprovalStepEntity>>;

  count(query: CountItemDto, manager?: EntityManager): Promise<any>;
}
