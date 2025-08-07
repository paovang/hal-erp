import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { IncreaseBudgetEntity } from '@src/modules/manage/domain/entities/increase-budget.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_INCREASE_BUDGET_REPOSITORY } from '../../../constants/inject-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadIncreaseBudgetRepository } from '@src/modules/manage/domain/ports/output/increase-budget-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<IncreaseBudgetEntity>>
{
  constructor(
    @Inject(READ_INCREASE_BUDGET_REPOSITORY)
    private readonly _readRepo: IReadIncreaseBudgetRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<IncreaseBudgetEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        { property: 'increase budget' },
      );
    }

    return data;
  }
}
