import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { READ_COMPANY_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import { IReadCompanyRepository } from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserContextService } from '@common/infrastructure/cls/cls.service';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<CompanyEntity>>
{
  constructor(
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly _readRepo: IReadCompanyRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<CompanyEntity>> {
    const user = this._userContextService.getAuthUser()?.user;
    const departmentUser =
      this._userContextService.getAuthUser()?.departmentUser;
    console.log('Auth User:', user);
    console.log('Auth Department User:', departmentUser);

    return await this._readRepo.findAll(query.dto, query.manager);
  }
}