import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteVatCommand } from '../delete.command';
import { WRITE_VAT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UnitOrmEntity } from '@src/common/infrastructure/database/typeorm/unit.orm';
import { UnitId } from '@src/modules/manage/domain/value-objects/unit-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IWriteVatRepository } from '@src/modules/manage/domain/ports/output/vat-repository.interface';

@CommandHandler(DeleteVatCommand)
export class DeleteVatCommandHandler
  implements IQueryHandler<DeleteVatCommand, void>
{
  constructor(
    @Inject(WRITE_VAT_REPOSITORY)
    private readonly _write: IWriteVatRepository,
  ) {}

  async execute(query: DeleteVatCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    /** Check Exits Document Type Id */
    await findOneOrFail(query.manager, UnitOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(new UnitId(query.id), query.manager);
  }
}
