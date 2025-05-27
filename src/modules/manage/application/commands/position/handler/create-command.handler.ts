import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PositionEntity } from '@src/modules/manage/domain/entities/position.entity';
import { Inject } from '@nestjs/common';
import { WRITE_POSITION_REPOSITORY } from '../../../constants/inject-key.const';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { PositionOrmEntity } from '@src/common/infrastructure/database/typeorm/position.orm';
import { IWritePositionRepository } from '@src/modules/manage/domain/ports/output/position-repository.interface';
import { PositionDataMapper } from '../../../mappers/position.mapper';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<PositionEntity>>
{
  constructor(
    @Inject(WRITE_POSITION_REPOSITORY)
    private readonly _write: IWritePositionRepository,
    private readonly _dataMapper: PositionDataMapper,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<PositionEntity>> {
    await _checkColumnDuplicate(
      PositionOrmEntity,
      'name',
      query.dto.name,
      query.manager,
      'errors.name_already_exists',
    );

    const entity = this._dataMapper.toEntity(query.dto);

    return await this._write.create(entity, query.manager);
  }
}
