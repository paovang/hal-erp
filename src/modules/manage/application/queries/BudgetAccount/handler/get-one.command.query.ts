import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountId } from '@src/modules/manage/domain/value-objects/budget-account-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { IReadBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { READ_BUDGET_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<BudgetAccountEntity>>
{
  constructor(
    @Inject(READ_BUDGET_ACCOUNT_REPOSITORY)
    private readonly _readRepo: IReadBudgetAccountRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    await this.checkData(query);
    await findOneOrFail(query.manager, BudgetAccountOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new BudgetAccountId(query.id),
      query.manager,
    );
  }

  private async checkData(query: GetOneQuery): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
  }
}
