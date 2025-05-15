import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { IDepartmentServiceInterface } from '@src/modules/manage/domain/ports/input/department-domain-service.interface';
import { GetAllQuery } from '@src/modules/manage/application/queries/department/get-all.query';
import { DepartmentQueryDto } from '@src/modules/manage/application/dto/query/department-query.dto';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';

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
}
