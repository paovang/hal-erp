import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { READ_COMPANY_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { CompanyVendorEntity } from '@src/modules/manage/domain/entities/company-vendor.entity';
import { IReadCompanyVendorRepository } from '@src/modules/manage/domain/ports/output/company-vendor-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<CompanyVendorEntity>>
{
  constructor(
    @Inject(READ_COMPANY_VENDOR_REPOSITORY)
    private readonly _read: IReadCompanyVendorRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user?.id;

    const company_user = await query.manager.findOne(CompanyUserOrmEntity, {
      where: {
        user_id: user_id,
      },
    });

    const company_id = company_user?.company_id ?? undefined;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    return await this._read.findAll(
      query.dto,
      query.manager,
      roles,
      company_id,
    );
  }
}
