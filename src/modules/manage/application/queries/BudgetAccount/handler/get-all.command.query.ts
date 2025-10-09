import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import { READ_BUDGET_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<BudgetAccountEntity>>
{
  constructor(
    @Inject(READ_BUDGET_ACCOUNT_REPOSITORY)
    private readonly _readRepo: IReadBudgetAccountRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
