import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ApprovalDto } from '../dto/create/userApprovalStep/update-statue.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalStepEntity } from '../../domain/entities/user-approval-step.entity';
import { ApproveCommand } from '../commands/userApprovalStep/approve.command';
import { IUserApprovalStepServiceInterface } from '../../domain/ports/input/user-approval-step-domain-service.interface';
import { ApproveStepCommand } from '../commands/userApprovalStep/approve-step.command';

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

  async update(
    id: number,
    dto: ApprovalDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserApprovalStepEntity>> {
    return await this._commandBus.execute(
      new ApproveCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async create(
    stepId: number,
    dto: ApprovalDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserApprovalStepEntity>> {
    return await this._commandBus.execute(
      new ApproveStepCommand(stepId, dto, manager ?? this._readEntityManager),
    );
  }
}
