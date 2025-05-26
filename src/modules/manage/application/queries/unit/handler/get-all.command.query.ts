import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UnitEntity } from '@src/modules/manage/domain/entities/unit.entity';
import { READ_UNIT_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject, NotFoundException } from '@nestjs/common';
import { IReadUnitRepository } from '@src/modules/manage/domain/ports/output/unit-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<UnitEntity>>
{
  constructor(
    @Inject(READ_UNIT_REPOSITORY)
    private readonly _readRepo: IReadUnitRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<UnitEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new NotFoundException('No units found.');
    }

    return data;
  }
}
