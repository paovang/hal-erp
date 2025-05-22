import { EntityManager } from "typeorm";
import { CreateDepartmentUserDto } from "../dto/create/departmentUser/create.dto";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { DepartmentUserEntity } from "../../domain/entities/department-user.entity";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Injectable } from "@nestjs/common";
import { IDepartmentUserServiceInterface } from "../../domain/ports/input/department-user-domain-service.interface";
import { InjectEntityManager } from "@nestjs/typeorm";
import { CreateCommand } from "../commands/departmentUser/create.command";

@Injectable()
export class DepartmentUserService implements IDepartmentUserServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateDepartmentUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

//   async getAll(
//     dto: DepartmentQueryDto,
//     manager?: EntityManager,
//   ): Promise<ResponseResult<DepartmentEntity>> {
//     return await this._queryBus.execute(
//       new GetAllQuery(dto, manager ?? this._readEntityManager),
//     );
//   }

//   async getOne(
//     id: number,
//     manager?: EntityManager,
//   ): Promise<ResponseResult<DepartmentEntity>> {
//     return await this._queryBus.execute(
//       new GetOneQuery(id, manager ?? this._readEntityManager),
//     );
//   }



//   async update(
//     id: number,
//     dto: UpdateDepartmentDto,
//     manager?: EntityManager,
//   ): Promise<ResponseResult<DepartmentEntity>> {
//     return await this._commandBus.execute(
//       new UpdateCommand(id, dto, manager ?? this._readEntityManager),
//     );
//   }

//   async delete(id: number, manager?: EntityManager): Promise<void> {
//     return await this._commandBus.execute(
//       new DeleteCommand(id, manager ?? this._readEntityManager),
//     );
//   }
}