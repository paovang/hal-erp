import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { VendorEntity } from '@src/modules/manage/domain/entities/vendor.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadVendorRepository } from '@src/modules/manage/domain/ports/output/vendor-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorId } from '@src/modules/manage/domain/value-objects/vendor-id.vo';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<VendorEntity>>
{
  constructor(
    @Inject(READ_VENDOR_REPOSITORY)
    private readonly _readRepo: IReadVendorRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<VendorEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, VendorOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(new VendorId(query.id), query.manager);
  }
}
