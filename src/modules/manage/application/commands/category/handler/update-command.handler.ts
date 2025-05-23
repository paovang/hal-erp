import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { CategoryEntity } from '@src/modules/manage/domain/entities/category.entity';
import { Inject } from '@nestjs/common';
import { WRITE_CATEGORY_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteCategoryRepository } from '@src/modules/manage/domain/ports/output/category-repository.interface';
import { CategoryDataMapper } from '../../../mappers/category.mapper';
import { CategoryId } from '@src/modules/manage/domain/value-objects/category-id.vo';
import { CategoryOrmEntity } from '@src/common/infrastructure/database/typeorm/category.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<CategoryEntity>>
{
  constructor(
    @Inject(WRITE_CATEGORY_REPOSITORY)
    private readonly _write: IWriteCategoryRepository,
    private readonly _dataMapper: CategoryDataMapper,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    if (isNaN(query.id)) {
      throw new Error('ID must be a number');
    }

    await _checkColumnDuplicate(
      CategoryOrmEntity,
      'name',
      query.dto.name,
      query.manager,
      'Name already exists',
      query.id,
    );

    const entity = this._dataMapper.toEntity(query.dto);
    await entity.initializeUpdateSetId(new CategoryId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, CategoryOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
