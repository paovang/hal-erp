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

@Injectable()
export class CompanyUserService implements ICompanyUserServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  create(
    body: CreateCompanyUserDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return this._commandBus.execute(
      new CreateCompanyUserCommand(body, manager ?? this._readEntityManager),
    );
  }

  getAll(
    dto: CompanyUserQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }
}
