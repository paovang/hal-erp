import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_COMPANY_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteCompanyProductRepository } from '@src/modules/manage/domain/ports/output/company-product-repository.interface';
import { CompanyProductId } from '@src/modules/manage/domain/value-objects/company-product-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyProductOrmEntity } from '@src/common/infrastructure/database/typeorm/company-product.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_COMPANY_PRODUCT_REPOSITORY)
    private readonly _write: IWriteCompanyProductRepository,
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
      CompanyProductOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );
    const id = new CompanyProductId(query.id);
    await this._write.delete(id, query.manager);
  }
}
