import { Injectable } from '@nestjs/common';
import { ICompanyUserServiceInterface } from '../../domain/ports/input/company-user-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyUserEntity } from '../../domain/entities/company-user.entity';
import { CreateCompanyUserDto } from '../dto/create/companyUser/create.dto';
import { CreateCompanyUserCommand } from '../commands/companyUser/create.command';
import { CompanyUserQueryDto } from '../dto/query/company-user-query.dto';
import { GetAllQuery } from '../queries/companyUser/get-all.query';
import { GetOneQuery } from '../queries/companyUser/get-one.query';
import { UpdateCompanyUserDto } from '../dto/create/companyUser/update.dto';
import { UpdateCompanyUserCommand } from '../commands/companyUser/update.command';
import { DeleteCompanyUserCommand } from '../commands/companyUser/delete.command';

@Injectable()
export class CompanyUserService implements ICompanyUserServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    body: CreateCompanyUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return await this._commandBus.execute(
      new CreateCompanyUserCommand(body, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: CompanyUserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    body: UpdateCompanyUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return await this._commandBus.execute(
      new UpdateCompanyUserCommand(
        id,
        body,
        manager ?? this._readEntityManager,
      ),
    );
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    return await this._commandBus.execute(
      new DeleteCompanyUserCommand(id, manager ?? this._readEntityManager),
    );
  }
}
