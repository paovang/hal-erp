import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { WRITE_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteProductRepository } from '@src/modules/manage/domain/ports/output/product-repository.interface';
import { ProductId } from '@src/modules/manage/domain/value-objects/product-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements ICommandHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_PRODUCT_REPOSITORY)
    private readonly _write: IWriteProductRepository,
  ) {}

  async execute(command: DeleteCommand): Promise<void> {
    await this.checkData(command);

    const productId = new ProductId(command.id);
    await this._write.delete(productId, command.manager);
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
    await findOneOrFail(query.manager, ProductOrmEntity, {
      id: query.id,
    });
  }
}
