import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject } from '@nestjs/common';
import { READ_COMPANY_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { CompanyProductEntity } from '@src/modules/manage/domain/entities/company-product.entity';
import { IReadCompanyProductRepository } from '@src/modules/manage/domain/ports/output/company-product-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyProductOrmEntity } from '@src/common/infrastructure/database/typeorm/company-product.orm';
import { CompanyProductId } from '@src/modules/manage/domain/value-objects/company-product-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<CompanyProductEntity>>
{
  constructor(
    @Inject(READ_COMPANY_PRODUCT_REPOSITORY)
    private readonly _read: IReadCompanyProductRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    await findOneOrFail(
      query.manager,
      CompanyProductOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );
    const id = new CompanyProductId(query.id);
    return await this._read.findOne(id, query.manager);
  }
}
