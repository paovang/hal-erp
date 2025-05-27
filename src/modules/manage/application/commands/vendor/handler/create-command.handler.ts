import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { WRITE_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { VendorEntity } from '@src/modules/manage/domain/entities/vendor.entity';
import { IWriteVendorRepository } from '@src/modules/manage/domain/ports/output/vendor-repository.interface';
import { VendorDataMapper } from '../../../mappers/vendor.mapper';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<VendorEntity>>
{
  constructor(
    @Inject(WRITE_VENDOR_REPOSITORY)
    private readonly _write: IWriteVendorRepository,
    private readonly _dataMapper: VendorDataMapper,
  ) {}

  async execute(query: CreateCommand): Promise<ResponseResult<VendorEntity>> {
    const entity = this._dataMapper.toEntity(query.dto);

    return await this._write.create(entity, query.manager);
  }
}
