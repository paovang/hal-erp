import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetReportQuery } from '../report.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { BudgetAccountEntity } from '@src/modules/manage/domain/entities/budget-account.entity';
import { READ_BUDGET_ACCOUNT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadBudgetAccountRepository } from '@src/modules/manage/domain/ports/output/budget-account-repository.interface';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetReportQuery)
export class GetReportQueryHandler
  implements IQueryHandler<GetReportQuery, ResponseResult<BudgetAccountEntity>>
{
  constructor(
    @Inject(READ_BUDGET_ACCOUNT_REPOSITORY)
    private readonly _readRepo: IReadBudgetAccountRepository,
  ) {}

  async execute(
    query: GetReportQuery,
  ): Promise<ResponseResult<BudgetAccountEntity>> {
    await this.checkData(query);
    await findOneOrFail(
      query.manager,
      BudgetAccountOrmEntity,
      {
        id: query.id,
      },
      `id ${query.id}`,
    );

    return await this._readRepo.report(
      new DepartmentId(query.id),
      query.query,
      query.manager,
    );
  }

  private async checkData(query: GetReportQuery): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
  }
}
