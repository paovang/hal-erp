import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductEntity } from '@src/modules/manage/domain/entities/product.entity';
import { READ_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadProductRepository } from '@src/modules/manage/domain/ports/output/product-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<ProductEntity>>
{
  constructor(
    @Inject(READ_PRODUCT_REPOSITORY)
    private readonly _readRepo: IReadProductRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<ProductEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
