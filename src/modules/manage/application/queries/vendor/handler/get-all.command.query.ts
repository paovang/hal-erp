import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { READ_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { VendorEntity } from '@src/modules/manage/domain/entities/vendor.entity';
import { IReadVendorRepository } from '@src/modules/manage/domain/ports/output/vendor-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<VendorEntity>>
{
  constructor(
    @Inject(READ_VENDOR_REPOSITORY)
    private readonly _readRepo: IReadVendorRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<VendorEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new NotFoundException('No units found.');
    }

    return data;
  }
}
