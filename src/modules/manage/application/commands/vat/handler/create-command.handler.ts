import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CreateVatCommand } from '../create.command';
import { WRITE_UNIT_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { VatEntity } from '@src/modules/manage/domain/entities/vat.entity';
import { VatOrmEntity } from '@src/common/infrastructure/database/typeorm/vat.orm';
import { IWriteVatRepository } from '@src/modules/manage/domain/ports/output/vat-repository.interface';
import { VatDataMapper } from '../../../mappers/vat.mapper';

@CommandHandler(CreateVatCommand)
export class CreateVatCommandHandler
  implements IQueryHandler<CreateVatCommand, ResponseResult<VatEntity>>
{
  constructor(
    @Inject(WRITE_UNIT_REPOSITORY)
    private readonly _write: IWriteVatRepository,
    private readonly _dataMapper: VatDataMapper,
  ) {}

  async execute(query: CreateVatCommand): Promise<ResponseResult<VatEntity>> {
    await _checkColumnDuplicate(
      VatOrmEntity,
      'amount',
      query.dto.amount,
      query.manager,
      'errors.name_already_exists',
    );

    const entity = this._dataMapper.toEntity(query.dto);

    return await this._write.create(entity, query.manager);
  }
}
