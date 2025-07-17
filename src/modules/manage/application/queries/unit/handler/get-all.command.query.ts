import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { READ_UNIT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadVatRepository } from '@src/modules/manage/domain/ports/output/vat-repository.interface';
import { VatEntity } from '@src/modules/manage/domain/entities/vat.entity';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<VatEntity>>
{
  constructor(
    @Inject(READ_UNIT_REPOSITORY)
    private readonly _readRepo: IReadVatRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<VatEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
