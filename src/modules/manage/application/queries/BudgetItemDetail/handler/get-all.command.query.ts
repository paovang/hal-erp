import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetItemDetailEntity } from '@src/modules/manage/domain/entities/budget-item-detail.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_BUDGET_ITEM_DETAIL_REPOSITORY } from '../../../constants/inject-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadBudgetItemDetailRepository } from '@src/modules/manage/domain/ports/output/budget-item-detail-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetItemOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-item.orm';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<BudgetItemDetailEntity>>
{
  constructor(
    @Inject(READ_BUDGET_ITEM_DETAIL_REPOSITORY)
    private readonly _readRepo: IReadBudgetItemDetailRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<BudgetItemDetailEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, BudgetItemOrmEntity, {
      id: query.id,
    });

    const data = await this._readRepo.findAll(
      query.id,
      query.dto,
      query.manager,
    );

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
