import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { IncreaseBudgetDetailEntity } from '@src/modules/manage/domain/entities/increase-budget-detail.entity';
import { READ_INCREASE_BUDGET_DETAIL_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadIncreaseBudgetDetailRepository } from '@src/modules/manage/domain/ports/output/increase-budget-detail-repository.interface';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements
    IQueryHandler<GetAllQuery, ResponseResult<IncreaseBudgetDetailEntity>>
{
  constructor(
    @Inject(READ_INCREASE_BUDGET_DETAIL_REPOSITORY)
    private readonly _readRepo: IReadIncreaseBudgetDetailRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<IncreaseBudgetDetailEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    // await findOneOrFail(
    //   query.manager,
    //   IncreaseBudgetDetailOrmEntity,
    //   {
    //     increase_budget_id: query.id,
    //   },
    //   'increase budget detail',
    // );

    const data = await this._readRepo.findAll(
      query.id,
      query.dto,
      query.manager,
    );

    if (!data) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        { property: 'increase budget detail' },
      );
    }

    return data;
  }
}
