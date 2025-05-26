import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IDepartmentServiceInterface } from '@src/modules/manage/domain/ports/input/department-domain-service.interface';
import { GetAllQuery } from '@src/modules/manage/application/queries/department/get-all.query';
import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { CreateDepartmentDto } from '@src/modules/manage/application/dto/create/department/create.dto';
import { CreateCommand } from '@src/modules/manage/application/commands/department/create.command';
import { UpdateCommand } from '@src/modules/manage/application/commands/department/update.command';
import { UpdateDepartmentDto } from '@src/modules/manage/application/dto/create/department/update.dto';
import { DeleteCommand } from '@src/modules/manage/application/commands/department/delete.command';
import { GetOneQuery } from '@src/modules/manage/application/queries/department/get-one.query';

@Injectable()
export class DepartmentService implements IDepartmentServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: DepartmentQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreateDepartmentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateDepartmentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentEntity>> {
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
