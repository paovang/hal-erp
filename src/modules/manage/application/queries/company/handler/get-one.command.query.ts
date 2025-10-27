import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { READ_COMPANY_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { IReadCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<CompanyEntity>>
{
  constructor(
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly _readRepo: IReadCompanyRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<CompanyEntity>> {
    const companyId = new CompanyId(query.id);
    return await this._readRepo.findOne(companyId, query.manager);
  }
}