import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetItemIdQuery } from '../get-item-id.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemEntity } from '@src/modules/manage/domain/entities/budget-item.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_BUDGET_ITEM_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadBudgetItemRepository } from '@src/modules/manage/domain/ports/output/budget-item-repository.interace';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetItemId } from '@src/modules/manage/domain/value-objects/budget-item-id.vo';

@QueryHandler(GetItemIdQuery)
export class GetItemIdQueryHandler
  implements IQueryHandler<GetItemIdQuery, ResponseResult<BudgetItemEntity>>
{
  constructor(
    @Inject(READ_BUDGET_ITEM_REPOSITORY)
    private readonly _readRepo: IReadBudgetItemRepository,
  ) {}

  async execute(
    query: GetItemIdQuery,
  ): Promise<ResponseResult<BudgetItemEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, BudgetItemOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.getItemId(
      new BudgetItemId(query.id),
      query.manager,
    );
  }
}
