import { Injectable } from '@nestjs/common';
import { ICategoryServiceInterface } from '../../domain/ports/input/category-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CreateCategoryDto } from '../dto/create/category/create.dto';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CreateCommand } from '../commands/category/create.command';
import { CategoryQueryDto } from '../dto/query/category-query.dto';
import { GetAllQuery } from '../queries/category/get-all.query';
import { GetOneQuery } from '../queries/category/get-one.query';
import { UpdateCategoryDto } from '../dto/create/category/update.dto';
import { UpdateCommand } from '../commands/category/update.command';
import { DeleteCommand } from '../commands/category/delete.command';

@Injectable()
export class CategoryService implements ICategoryServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async create(
    dto: CreateCategoryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>> {
    return await this._commandBus.execute(
      new CreateCommand(dto, manager ?? this._readEntityManager),
    );
  }

  async getAll(
    dto: CategoryQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  async getOne(
    id: number,
    manager?: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>> {
    return await this._queryBus.execute(
      new GetOneQuery(id, manager ?? this._readEntityManager),
    );
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<CategoryEntity>> {
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
