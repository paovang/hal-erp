import { Injectable } from "@nestjs/common";
import { IRoleServiceInterface } from "../../domain/ports/input/role-domain-service.interface";
import { QueryBus } from "@nestjs/cqrs";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager } from "typeorm";
import { RoleQueryDto } from "../dto/query/role-query.dto";
import { RoleEntity } from "../../domain/entities/role.entity";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { GetAllQuery } from "../queries/user/role/get-all.query";
import { GetOneQuery } from "../queries/user/role/get-one.query";

@Injectable()
export class RoleService implements IRoleServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    // private readonly _commandBus: CommandBus,
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
}