import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { WRITE_CURRENCY_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteCurrencyRepository } from '@src/modules/manage/domain/ports/output/currency-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { CurrencyId } from '@src/modules/manage/domain/value-objects/currency-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_CURRENCY_REPOSITORY)
    private readonly _write: IWriteCurrencyRepository,
  ) {}
  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new BadRequestException('ID must be a number');
    }
    /** Check Exits CategoryId Id */
    await findOneOrFail(query.manager, CurrencyOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(new CurrencyId(query.id), query.manager);
  }
}
