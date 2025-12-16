import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IApprovalWorkflowStepServiceInterface } from '../../domain/ports/input/approval-workflow-domain-service.interface';
import { CreateApprovalWorkflowStepDto } from '../dto/create/approvalWorkflowStep/create.dto';
import { ApprovalWorkflowStepEntity } from '../../domain/entities/approval-workflow-step.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCommand } from '../commands/approvalWorkflowStep/create.command';
import { ApprovalWorkflowStepQueryDto } from '../dto/query/approval-workflow-step.dto';
import { GetAllQuery } from '../queries/approvalWorkflowStep/get-all.query';
import { GetOneQuery } from '../queries/approvalWorkflowStep/get-one.query';
import { UpdateApprovalWorkflowStepDto } from '../dto/create/approvalWorkflowStep/update.dto';
import { UpdateCommand } from '../commands/approvalWorkflowStep/update.command';
import { DeleteCommand } from '../commands/approvalWorkflowStep/delete.command';
import { OrderByApprovalWorkflowStepDto } from '../dto/create/approvalWorkflowStep/order-by.dto';
import { OrderByCommand } from '../commands/approvalWorkflowStep/order-by.command';

@Injectable()
export class ApprovalWorkflowStepService
  implements IApprovalWorkflowStepServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    id: number,
    dto: CreateApprovalWorkflowStepDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    id: number,
    dto: ApprovalWorkflowStepQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(id, dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateApprovalWorkflowStepDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async orderBy(
    id: number,
    dto: OrderByApprovalWorkflowStepDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    return await this._commandBus.execute(
      new OrderByCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
