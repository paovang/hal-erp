import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { READ_QUOTA_COMPANY_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadQuotaCompanyRepository } from '@src/modules/manage/domain/ports/output/quota-company-repository.interface';
import { QuotaCompanyEntity } from '@src/modules/manage/domain/entities/quota-company.entity';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<QuotaCompanyEntity>>
{
  constructor(
    @Inject(READ_QUOTA_COMPANY_REPOSITORY)
    private readonly _readRepo: IReadQuotaCompanyRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
