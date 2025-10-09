import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { READ_VAT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { GetOneVatQuery } from '../get-one.query';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { VatEntity } from '@src/modules/manage/domain/entities/vat.entity';
import { VatOrmEntity } from '@src/common/infrastructure/database/typeorm/vat.orm';
import { VatId } from '@src/modules/manage/domain/value-objects/vat-id.vo';
import { IReadVatRepository } from '@src/modules/manage/domain/ports/output/vat-repository.interface';

@QueryHandler(GetOneVatQuery)
export class GetOneVatQueryHandler
  implements IQueryHandler<GetOneVatQuery, ResponseResult<VatEntity>>
{
  constructor(
    @Inject(READ_VAT_REPOSITORY)
    private readonly _readRepo: IReadVatRepository,
  ) {}

  async execute(query: GetOneVatQuery): Promise<ResponseResult<VatEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, VatOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(new VatId(query.id), query.manager);
  }
}
