import { Injectable } from '@nestjs/common';
import { IDepartmentApproverServiceInterface } from '../../domain/ports/input/department-approver-domian-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateDepartmentApproverDto } from '../dto/create/departmentApprover/create.dto';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DepartmentApproverEntity } from '../../domain/entities/department-approver.entity';
import { CreateCommand } from '../commands/departmentApprover/create.command';
import { GetAllQuery } from '../queries/departmentApprover/get-all.query';
import { DepartmentApproverQueryDto } from '../dto/query/department-approver.dto';
import { GetOneQuery } from '../queries/departmentApprover/get-one.query';
import { UpdateDepartmentApproverDto } from '../dto/create/departmentApprover/update.dto';
import { UpdateCommand } from '../commands/departmentApprover/update.command';
import { DeleteCommand } from '../commands/departmentApprover/delete.command';

@Injectable()
export class DepartmentApproverService
  implements IDepartmentApproverServiceInterface
{
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateDepartmentApproverDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: DepartmentApproverQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDepartmentApproverDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
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
