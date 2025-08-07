import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetEntity } from '@src/modules/manage/domain/entities/increase-budget.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_INCREASE_BUDGET_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';
import { IncreaseBudgetDataMapper } from '../../../mappers/increase-budget.mapper';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IncreaseBudgetOrmEntity } from '@src/common/infrastructure/database/typeorm/increase-budget.orm';
import { IncreaseBudgetId } from '@src/modules/manage/domain/value-objects/increase-budget-id.vo';
@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<IncreaseBudgetEntity>>
{
  constructor(
    @Inject(WRITE_INCREASE_BUDGET_REPOSITORY)
    private readonly _write: IWriteIncreaseBudgetRepository,
    private readonly _dataMapper: IncreaseBudgetDataMapper,
  ) {}
  async execute(query: UpdateCommand): Promise<any> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(query.manager, IncreaseBudgetOrmEntity, {
      id: query.id,
    });

    // Map to entity
    const entity = this._dataMapper.toEntity(query.dto);

    // Set and validate ID
    await entity.initializeUpdateSetId(new IncreaseBudgetId(query.id));
    await entity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(query.manager, IncreaseBudgetOrmEntity, {
      id: entity.getId().value,
    });

    return this._write.update(entity, query.manager);
  }
}
