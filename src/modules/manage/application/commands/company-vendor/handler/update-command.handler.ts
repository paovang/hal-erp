import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_COMPANY_VENDOR_REPOSITORY } from '../../../constants/inject-key.const';
import { CompanyVendorEntity } from '@src/modules/manage/domain/entities/company-vendor.entity';
import { IWriteCompanyVendorRepository } from '@src/modules/manage/domain/ports/output/company-vendor-repository.interface';
import { CompanyVendorDataMapper } from '../../../mappers/company-vendor.mapper';
import { CompanyVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/company-vendor.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyVendorId } from '@src/modules/manage/domain/value-objects/company-vendor-id.vo';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<CompanyVendorEntity>>
{
  constructor(
    @Inject(WRITE_COMPANY_VENDOR_REPOSITORY)
    private readonly _write: IWriteCompanyVendorRepository,
    private readonly _dataMapper: CompanyVendorDataMapper,
  ) {}

  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    await this.checkData(query);
    // Map to entity
    const entity = this._dataMapper.toEntity(query.dto);

    // Set and validate ID
    await entity.initializeUpdateSetId(new CompanyVendorId(query.id));
    await entity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(query.manager, CompanyVendorOrmEntity, {
      id: entity.getId().value,
    });
    return await this._write.update(entity, query.manager);
  }

  private async checkData(query: UpdateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(
      query.manager,
      CompanyVendorOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );

    if (query.dto.vendor_id) {
      await findOneOrFail(
        query.manager,
        VendorOrmEntity,
        {
          id: query.dto.vendor_id,
        },
        `${query.dto.vendor_id}`,
      );
    }

    if (query.dto.company_id) {
      await findOneOrFail(
        query.manager,
        CompanyOrmEntity,
        {
          id: query.dto.company_id,
        },
        `${query.dto.company_id}`,
      );
    }
  }
}
