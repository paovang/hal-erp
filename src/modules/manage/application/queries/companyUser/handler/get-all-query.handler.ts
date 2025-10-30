import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyUserEntity } from '@src/modules/manage/domain/entities/company-user.entity';
import { READ_COMPANY_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { IReadCompanyUserRepository } from '@src/modules/manage/domain/ports/output/company-user-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<CompanyUserEntity>>
{
  constructor(
    @Inject(READ_COMPANY_USER_REPOSITORY)
    private readonly _readRepo: IReadCompanyUserRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    return await this._readRepo.findAll(query.dto, query.manager);
  }
}
