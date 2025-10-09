import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';
import { IUserServiceInterface } from '../../domain/ports/input/user-domain-service.interface';
import { CreateUserDto } from '../dto/create/user/create.dto';
import { CreateCommand } from '../commands/user/create.command';
import { UserQueryDto } from '../dto/query/user-query.dto';
import { GetAllQuery } from '../queries/user/get-all.query';
import { GetOneQuery } from '../queries/user/get-one.query';
import { UpdateUserDto } from '../dto/create/user/update.dto';
import { UpdateCommand } from '../commands/user/update-command';
import { DeleteCommand } from '../commands/user/delete.command';
import { ChangePasswordDto } from '../dto/create/user/change-password.dto';
import { ChangePasswordCommand } from '../commands/user/change-password.command';
import { SendMailDto } from '../dto/create/user/send-email.dto';
import { SendMailCommand } from '../commands/user/send-mail.command';
import { LoginCommand } from '../commands/user/login.command';

@Injectable()
export class UserService implements IUserServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async login(dto: any, manager?: EntityManager): Promise<any> {
    return await this._commandBus.execute(
      new LoginCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: UserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async create(
    dto: CreateUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    return await this._commandBus.execute(
      new UpdateCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async changePassword(
    id: number,
    dto: ChangePasswordDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    return await this._commandBus.execute(
      new ChangePasswordCommand(id, dto, manager ?? this._readEntityManager),
    );
  }

  async sendMail(
    dto: SendMailDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<UserEntity>> {
    return await this._commandBus.execute(
      new SendMailCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCommand(id, manager ?? this._readEntityManager),
    );
  }
}
