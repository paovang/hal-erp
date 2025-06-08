import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ProvinceEntity } from '@src/modules/manage/domain/entities/province.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_PROVINCE_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadProvinceRepository } from '@src/modules/manage/domain/ports/output/province-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<ProvinceEntity>>
{
  constructor(
    @Inject(READ_PROVINCE_REPOSITORY)
    private readonly _readRepo: IReadProvinceRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<ProvinceEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
