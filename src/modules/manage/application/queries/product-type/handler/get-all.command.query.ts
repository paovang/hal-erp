import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductTypeEntity } from '@src/modules/manage/domain/entities/product-type.entity';
import { READ_PRODUCT_TYPE_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadProductTypeRepository } from '@src/modules/manage/domain/ports/output/product-type-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<ProductTypeEntity>>
{
  constructor(
    @Inject(READ_PRODUCT_TYPE_REPOSITORY)
    private readonly _readRepo: IReadProductTypeRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<ProductTypeEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}