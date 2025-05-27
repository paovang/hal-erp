import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { READ_POSITION_REPOSITORY } from '../../../constants/inject-key.const';
import { PositionEntity } from '@src/modules/manage/domain/entities/position.entity';
import { IReadPositionRepository } from '@src/modules/manage/domain/ports/output/position-repository.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { PositionId } from '@src/modules/manage/domain/value-objects/position-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<PositionEntity>>
{
  constructor(
    @Inject(READ_POSITION_REPOSITORY)
    private readonly _readRepo: IReadPositionRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<PositionEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'error.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, PositionOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new PositionId(query.id),
      query.manager,
    );
  }
}
