import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IUserApprovalServiceInterface } from '../../domain/ports/input/user-approval-domain-service,interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { CreateUserApprovalDto } from '../dto/create/userApproval/create.dto';
import { UserApprovalEntity } from '../../domain/entities/user-approval.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CreateCommand } from '../commands/userApproval/create.command';

@Injectable()
export class UserApprovalService implements IUserApprovalServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  //   async getAll(
  //     dto: UnitQueryDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<UnitEntity>> {
  //     return await this._queryBus.execute(
  //       new GetAllQuery(dto, manager ?? this._readEntityManager),
  //     );
  //   }

  //   async getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<UnitEntity>> {
  //     return await this._queryBus.execute(
  //       new GetOneQuery(id, manager ?? this._readEntityManager),
  //     );
  //   }

  async create(
    dto: CreateUserApprovalDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserApprovalEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  //   async update(
  //     id: number,
  //     dto: UpdateUnitDto,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<UnitEntity>> {
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
