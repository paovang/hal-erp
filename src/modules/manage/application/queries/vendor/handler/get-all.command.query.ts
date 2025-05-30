import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { VendorEntity } from '@src/modules/manage/domain/entities/vendor.entity';
import { IReadVendorRepository } from '@src/modules/manage/domain/ports/output/vendor-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

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
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
