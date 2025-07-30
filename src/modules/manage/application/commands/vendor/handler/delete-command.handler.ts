import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteVendorRepository } from '@src/modules/manage/domain/ports/output/vendor-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { VendorId } from '@src/modules/manage/domain/value-objects/vendor-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { VendorBankAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor_bank_account.orm';
import { PurchaseOrderSelectedVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-order-selected-vendor.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_VENDOR_REPOSITORY)
    private readonly _write: IWriteVendorRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    await this.checkData(query);

    return await this._write.delete(new VendorId(query.id), query.manager);
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, VendorOrmEntity, {
      id: query.id,
    });

    await checkRelationOrThrow(
      query.manager,
      VendorBankAccountOrmEntity,
      { vendor_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'vendor bank account',
    );

    await checkRelationOrThrow(
      query.manager,
      PurchaseOrderSelectedVendorOrmEntity,
      { vendor_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'purchase order selected vendor',
    );
  }
}
