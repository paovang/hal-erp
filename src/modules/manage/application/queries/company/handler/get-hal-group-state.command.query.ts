import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetHalStateQuery } from '../get-hal-group-state.query';
import { READ_COMPANY_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { IReadCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserContextService } from '@common/infrastructure/cls/cls.service';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@QueryHandler(GetHalStateQuery)
export class GetHalGroupStateHandler
  implements IQueryHandler<GetHalStateQuery, ResponseResult<CompanyEntity>>
{
  constructor(
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly _readRepo: IReadCompanyRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetHalStateQuery): Promise<ResponseResult<any>> {
    return await this._readRepo.getHalGroupState(query.query, query.manager);
  }
}
