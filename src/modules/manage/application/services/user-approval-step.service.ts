import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ApprovalDto } from '../dto/create/userApprovalStep/update-statue.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalStepEntity } from '../../domain/entities/user-approval-step.entity';
import { IUserApprovalStepServiceInterface } from '../../domain/ports/input/user-approval-step-domain-service.interface';
import { ApproveStepCommand } from '../commands/userApprovalStep/approve-step.command';
import { SendOTPCommand } from '../commands/userApprovalStep/send-otp.command';
import { CountItemDto } from '../dto/query/count-item.dto';
import { CountItemQuery } from '../queries/userApprovalStep/count-item.query';

@Injectable()
export class UserApprovalStepService
  implements IUserApprovalStepServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async sendOTP(id: number, manager?: EntityManager): Promise<any> {
    return await this._commandBus.execute(
      new SendOTPCommand(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    stepId: number,
    dto: ApprovalDto,
    manager?: EntityManager,
    user_id?: number,
  ): Promise<ResponseResult<UserApprovalStepEntity>> {
    console.log('object');
    return await this._commandBus.execute(
      new ApproveStepCommand(
        stepId,
        dto,
        manager ?? this._readEntityManager,
        user_id,
      ),
    );
  }

  async count(
    query: CountItemDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<{ amount: number }>> {
    return await this._queryBus.execute(
      new CountItemQuery(query, manager ?? this._readEntityManager),
    );
  }
}
