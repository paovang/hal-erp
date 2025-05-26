import { Injectable } from '@nestjs/common';
import { IPermissionServiceInterface } from '../../domain/ports/input/permission-domain-service.interface';
import { QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { PermissionQueryDto } from '../dto/query/permission-query.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { GetAllQuery } from '../queries/user/permission/get-all.query';
import { PermissionGroupEntity } from '../../domain/entities/permission-group.entity';
import { GetOneQuery } from '../queries/user/permission/get-one.query';

@Injectable()
export class PermissionService implements IPermissionServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    // private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: PermissionQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<PermissionGroupEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<PermissionGroupEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }
}
