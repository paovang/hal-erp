import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { READ_UNIT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadUnitRepository } from '@src/modules/manage/domain/ports/output/unit-repository.interface';
import { UnitEntity } from '@src/modules/manage/domain/entities/unit.entity';

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
      throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
