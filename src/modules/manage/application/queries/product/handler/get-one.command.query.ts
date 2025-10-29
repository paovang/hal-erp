import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductEntity } from '@src/modules/manage/domain/entities/product.entity';
import { READ_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadProductRepository } from '@src/modules/manage/domain/ports/output/product-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { ProductId } from '@src/modules/manage/domain/value-objects/product-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<ProductEntity>>
{
  constructor(
    @Inject(READ_PRODUCT_REPOSITORY)
    private readonly _readRepo: IReadProductRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<ProductEntity>> {
    const productId = new ProductId(query.id);
    const data = await this._readRepo.findOne(productId, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}