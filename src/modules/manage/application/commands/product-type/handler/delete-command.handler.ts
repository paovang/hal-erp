import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_PRODUCT_TYPE_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteProductTypeRepository } from '@src/modules/manage/domain/ports/output/product-type-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { ProductTypeId } from '@src/modules/manage/domain/value-objects/product-type-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_PRODUCT_TYPE_REPOSITORY)
    private readonly _write: IWriteProductTypeRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    await this.checkData(query);

    return await this._write.delete(new ProductTypeId(query.id), query.manager);
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
    /** Check Exits ProductTypeId Id */
    await findOneOrFail(query.manager, ProductTypeOrmEntity, {
      id: query.id,
    });
  }
}
