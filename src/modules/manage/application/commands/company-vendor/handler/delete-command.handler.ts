import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_COMPANY_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteCompanyVendorRepository } from '@src/modules/manage/domain/ports/output/company-vendor-repository.interface';
import { CompanyVendorId } from '@src/modules/manage/domain/value-objects/company-vendor-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/company-vendor.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_COMPANY_VENDOR_REPOSITORY)
    private readonly _write: IWriteCompanyVendorRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(
      query.manager,
      CompanyVendorOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );
    const id = new CompanyVendorId(query.id);
    await this._write.delete(id, query.manager);
  }
}
