import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PositionEntity } from '@src/modules/manage/domain/entities/position.entity';
import { Inject, NotFoundException } from '@nestjs/common';
import { READ_POSITION_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadPositionRepository } from '@src/modules/manage/domain/ports/output/position-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<PositionEntity>>
{
  constructor(
    @Inject(READ_POSITION_REPOSITORY)
    private readonly _readRepo: IReadPositionRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<PositionEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new NotFoundException('No positions found.');
    }

    return data;
  }
}
