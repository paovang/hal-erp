import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { READ_VAT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import * as manageDomainException from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { VatEntity } from '@src/modules/manage/domain/entities/vat.entity';
import { GetAllVatQuery } from '../get-all.query';
import { IReadVatRepository } from '@src/modules/manage/domain/ports/output/vat-repository.interface';

@QueryHandler(GetAllVatQuery)
export class GetAllVatQueryHandler
  implements IQueryHandler<GetAllVatQuery, ResponseResult<VatEntity>>
{
  constructor(
    @Inject(READ_VAT_REPOSITORY)
    private readonly _readRepo: IReadVatRepository,
  ) {}

  async execute(query: GetAllVatQuery): Promise<ResponseResult<VatEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);
    if (!data) {
      throw new manageDomainException.ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
      );
    }

    return data;
  }
}
