import { Injectable } from '@nestjs/common';
import { IRoleServiceInterface } from '../../domain/ports/input/role-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { RoleQueryDto } from '../dto/query/role-query.dto';
import { RoleEntity } from '../../domain/entities/role.entity';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { GetAllQuery } from '../queries/user/role/get-all.query';
import { GetOneQuery } from '../queries/user/role/get-one.query';
import { CreateRoleDto } from '../dto/create/user/role/create.dto';
import { CreateCommand } from '../commands/role/create.command';
import { UpdateRoleDto } from '../dto/create/user/role/update.dto';
import { UpdateCommand } from '../commands/role/update.command';
import { DeleteCommand } from '../commands/role/delete.command';
import { CreateDto } from '../dto/create/user/role/create-role.dto';
import { CreateRoleCommand } from '../commands/role/create-role.command';
import { UpdateDto } from '../dto/create/user/role/update-role.dto';
import { UpdateRoleCommand } from '../commands/role/update-role.command';

@Injectable()
export class RoleService implements IRoleServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: RoleQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreateRoleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateRoleDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }

  // create role
  async createRole(
    dto: CreateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>> {
    return await this._commandBus.execute(
      new CreateRoleCommand(dto, manager ?? this._readEntityManager),
    );
  }

  // update role
  async updateRole(
    id: number,
    dto: UpdateDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<RoleEntity>> {
    return await this._commandBus.execute(
      new UpdateRoleCommand(id, dto, manager ?? this._readEntityManager),
    );
  }
}
