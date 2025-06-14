import { Injectable } from '@nestjs/common';
import { IApprovalWorkflowServiceInterface } from '../../domain/ports/input/approval-workflow-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ApprovalWorkflowEntity } from '../../domain/entities/approval-workflow.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCommand } from '../commands/ApprovalWorkflow/create.command';
import { GetAllQuery } from '../queries/ApprovalWorkflow/get-all.query';
import { GetOneQuery } from '../queries/ApprovalWorkflow/get-one.query';
import { UpdateCommand } from '../commands/ApprovalWorkflow/update.command';
import { DeleteCommand } from '../commands/ApprovalWorkflow/delete.command';
import { CreateApprovalWorkflowDto } from '../dto/create/approvalWorkflow/create.dto';
import { ApprovalWorkflowQueryDto } from '../dto/query/approval-workflow.dto';
import { UpdateApprovalWorkflowDto } from '../dto/create/approvalWorkflow/update.dto';

@Injectable()
export class ApprovalWorkflowService
  implements IApprovalWorkflowServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateApprovalWorkflowDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: ApprovalWorkflowQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateApprovalWorkflowDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
