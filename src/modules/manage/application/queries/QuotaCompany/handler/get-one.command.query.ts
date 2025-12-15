import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { READ_QUOTA_COMPANY_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { QuotaCompanyEntity } from '@src/modules/manage/domain/entities/quota-company.entity';
import { QuotaCompanyId } from '@src/modules/manage/domain/value-objects/quota-company-id.vo';
import { IReadQuotaCompanyRepository } from '@src/modules/manage/domain/ports/output/quota-company-repository.interface';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<QuotaCompanyEntity>>
{
  constructor(
    @Inject(READ_QUOTA_COMPANY_REPOSITORY)
    private readonly _readRepo: IReadQuotaCompanyRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    const productId = new QuotaCompanyId(query.id);
    const data = await this._readRepo.findOne(productId, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
