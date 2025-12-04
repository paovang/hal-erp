import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { READ_COMPANY_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserContextService } from '@common/infrastructure/cls/cls.service';
import { EligiblePersons } from '../../../constants/status-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { GetReportReceiptQuery } from '../get-report-receipt.query';

@QueryHandler(GetReportReceiptQuery)
export class GetReportReceiptQueryHandler
  implements IQueryHandler<GetReportReceiptQuery, ResponseResult<CompanyEntity>>
{
  constructor(
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly _readRepo: IReadCompanyRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetReportReceiptQuery,
  ): Promise<ResponseResult<CompanyEntity>> {
    const user = this._userContextService.getAuthUser()?.user;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    if (
      !roles.includes(EligiblePersons.SUPER_ADMIN) &&
      !roles.includes(EligiblePersons.ADMIN)
    ) {
      throw new ManageDomainException('errors.forbidden', HttpStatus.FORBIDDEN);
    }

    return await this._readRepo.getReportReceipt(query.query, query.manager);
  }
}
