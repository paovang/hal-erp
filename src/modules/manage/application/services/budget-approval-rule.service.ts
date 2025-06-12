import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { IBudgetApprovalRuleServiceInterface } from '../../domain/ports/input/budget-approval-rule-service.interface';
import { CreateBudgetApprovalRuleDto } from '../dto/create/budgetApprovalRule/create.dto';
import { BudgetApprovalRuleEntity } from '../../domain/entities/budget-approval-rule.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCommand } from '../commands/BudgetApprovalRule/create.command';
import { BudgetApprovalRuleQueryDto } from '../dto/query/budget-approval-rule.dto';
import { GetAllQuery } from '../queries/BudgetApprovalRule/get-all.query';
import { GetOneQuery } from '../queries/BudgetApprovalRule/get-one.query';
import { UpdateBudgetApprovalRuleDto } from '../dto/create/budgetApprovalRule/update.dto';
import { UpdateCommand } from '../commands/BudgetApprovalRule/update.command';
import { DeleteCommand } from '../commands/BudgetApprovalRule/delete.command';

@Injectable()
export class BudgetApprovalRuleService
  implements IBudgetApprovalRuleServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateBudgetApprovalRuleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: BudgetApprovalRuleQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateBudgetApprovalRuleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<BudgetApprovalRuleEntity>> {
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
