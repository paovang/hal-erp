import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteVendorRepository } from '@src/modules/manage/domain/ports/output/vendor-repository.interface';
import { VendorDataMapper } from '../../../mappers/vendor.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorEntity } from '@src/modules/manage/domain/entities/vendor.entity';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { VendorId } from '@src/modules/manage/domain/value-objects/vendor-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<VendorEntity>>
{
  constructor(
    @Inject(WRITE_VENDOR_REPOSITORY)
    private readonly _write: IWriteVendorRepository,
    private readonly _dataMapper: VendorDataMapper,
  ) {}
  async execute(query: UpdateCommand): Promise<any> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Map to entity
    const entity = this._dataMapper.toEntity(query.dto);

    // Set and validate ID
    await entity.initializeUpdateSetId(new VendorId(query.id));
    await entity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(query.manager, VendorOrmEntity, {
      id: entity.getId().value,
    });

    return this._write.update(entity, query.manager);
  }
}
