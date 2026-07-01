import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { READ_COMPANY_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { CompanyVendorEntity } from '@src/modules/manage/domain/entities/company-vendor.entity';
import { IReadCompanyVendorRepository } from '@src/modules/manage/domain/ports/output/company-vendor-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/company-vendor.orm';
import { CompanyVendorId } from '@src/modules/manage/domain/value-objects/company-vendor-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<CompanyVendorEntity>>
{
  constructor(
    @Inject(READ_COMPANY_VENDOR_REPOSITORY)
    private readonly _read: IReadCompanyVendorRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    await findOneOrFail(
      query.manager,
      CompanyVendorOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );
    const id = new CompanyVendorId(query.id);
    return await this._read.findOne(id, query.manager);
  }
}
