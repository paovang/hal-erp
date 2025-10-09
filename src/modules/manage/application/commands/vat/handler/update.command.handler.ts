import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateVatCommand } from '../update.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { WRITE_VAT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { VatEntity } from '@src/modules/manage/domain/entities/vat.entity';
import { VatOrmEntity } from '@src/common/infrastructure/database/typeorm/vat.orm';
import { VatId } from '@src/modules/manage/domain/value-objects/vat-id.vo';
import { VatDataMapper } from '../../../mappers/vat.mapper';
import { IWriteVatRepository } from '@src/modules/manage/domain/ports/output/vat-repository.interface';

@CommandHandler(UpdateVatCommand)
export class UpdateVatCommandHandler
  implements IQueryHandler<UpdateVatCommand, ResponseResult<VatEntity>>
{
  constructor(
    @Inject(WRITE_VAT_REPOSITORY)
    private readonly _write: IWriteVatRepository,
    private readonly _dataMapper: VatDataMapper,
  ) {}
  async execute(query: UpdateVatCommand): Promise<any> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(query.manager, VatOrmEntity, {
      id: query.id,
    });

    await _checkColumnDuplicate(
      VatOrmEntity,
      'amount',
      query.dto.amount,
      query.manager,
      'errors.name_already_exists',
      query.id,
    );

    // Map to entity
    const entity = this._dataMapper.toEntity(query.dto);

    // Set and validate ID
    await entity.initializeUpdateSetId(new VatId(query.id));
    await entity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(query.manager, VatOrmEntity, {
      id: entity.getId().value,
    });

    return this._write.update(entity, query.manager);
  }
}
