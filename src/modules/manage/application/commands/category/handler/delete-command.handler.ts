import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { WRITE_CATEGORY_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteCategoryRepository } from '@src/modules/manage/domain/ports/output/category-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';
import { CategoryId } from '@src/modules/manage/domain/value-objects/category-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_CATEGORY_REPOSITORY)
    private readonly _write: IWriteCategoryRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new BadRequestException('ID must be a number');
    }
    /** Check Exits CategoryId Id */
    await findOneOrFail(query.manager, CategoryOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(new CategoryId(query.id), query.manager);
  }
}
