import { Injectable } from '@nestjs/common';
import { IProvinceServiceInterface } from '../../domain/ports/input/province-domain-service.interface';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ProvinceEntity } from '../../domain/entities/province.entity';
import { ProvinceQueryDto } from '../dto/query/province.dto';
import { GetAllQuery } from '../queries/Province/get-all.query';

@Injectable()
export class ProvinceService implements IProvinceServiceInterface {
  constructor(
    private readonly _queryBus: QueryBus,
    private readonly _commandBus: CommandBus,
    @InjectEntityManager(process.env.CONNECTION_NAME)
    private readonly _readEntityManager: EntityManager,
  ) {}

  async getAll(
    dto: ProvinceQueryDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<ProvinceEntity>> {
    return await this._queryBus.execute(
      new GetAllQuery(dto, manager ?? this._readEntityManager),
    );
  }

  //   async getOne(
  //     id: number,
  //     manager?: EntityManager,
  //   ): Promise<ResponseResult<PositionEntity>> {
  //     return await this._queryBus.execute(
  //       new GetOneQuery(id, manager ?? this._readEntityManager),
  //     );
  //   }
}
