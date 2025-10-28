import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductTypeEntity } from '@src/modules/manage/domain/entities/product-type.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_PRODUCT_TYPE_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadProductTypeRepository } from '@src/modules/manage/domain/ports/output/product-type-repository.interface';
import { ProductTypeId } from '@src/modules/manage/domain/value-objects/product-type-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<ProductTypeEntity>>
{
  constructor(
    @Inject(READ_PRODUCT_TYPE_REPOSITORY)
    private readonly _readRepo: IReadProductTypeRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<ProductTypeEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, ProductTypeOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new ProductTypeId(query.id),
      query.manager,
    );
  }
}