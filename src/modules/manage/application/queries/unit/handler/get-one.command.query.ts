import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UnitEntity } from '@src/modules/manage/domain/entities/unit.entity';
import { READ_UNIT_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadUnitRepository } from '@src/modules/manage/domain/ports/output/unit-repository.interface';
import { BadRequestException, Inject } from '@nestjs/common';
import { UnitOrmEntity } from '@src/common/infrastructure/database/typeorm/unit.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UnitId } from '@src/modules/manage/domain/value-objects/unit-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<UnitEntity>>
{
  constructor(
    @Inject(READ_UNIT_REPOSITORY)
    private readonly _readRepo: IReadUnitRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<UnitEntity>> {
    if (isNaN(query.id)) {
      throw new BadRequestException('id must be a number');
    }

    await findOneOrFail(query.manager, UnitOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(new UnitId(query.id), query.manager);
  }
}
