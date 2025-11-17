import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductEntity } from '@src/modules/manage/domain/entities/product.entity';
import {
  WRITE_PRODUCT_REPOSITORY,
  WRITE_QUOTA_COMPANY_REPOSITORY,
} from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductDataMapper } from '../../../mappers/product.mapper';
import { IWriteProductRepository } from '@src/modules/manage/domain/ports/output/product-repository.interface';
import { ProductId } from '@src/modules/manage/domain/value-objects/product-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { UnitOrmEntity } from '@src/common/infrastructure/database/typeorm/unit.orm';
import { IWriteQuotaCompanyRepository } from '@src/modules/manage/domain/ports/output/quota-company-repository.interface';
import { QuotaCompanyDataMapper } from '../../../mappers/quota-company.mapper';
import { QuotaCompanyEntity } from '@src/modules/manage/domain/entities/quota-company.entity';
import { QuotaCompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/quota-company.orm';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { VendorProductOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor-product.orm';
import { QuotaCompanyId } from '@src/modules/manage/domain/value-objects/quota-company-id.vo';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<QuotaCompanyEntity>>
{
  constructor(
    @Inject(WRITE_QUOTA_COMPANY_REPOSITORY)
    private readonly _write: IWriteQuotaCompanyRepository,
    private readonly _dataMapper: QuotaCompanyDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
    await findOneOrFail(query.manager, QuotaCompanyOrmEntity, {
      id: query.id,
    });

    if (query.dto.company_id) {
      await findOneOrFail(
        query.manager,
        CompanyOrmEntity,
        {
          id: query.dto.company_id,
        },
        `product type id ${query.dto.company_id}`,
      );
    }
    if (query.dto.vendor_product_id) {
      await findOneOrFail(
        query.manager,
        VendorProductOrmEntity,
        {
          id: query.dto.vendor_product_id,
        },
        `unit id ${query.dto.vendor_product_id}`,
      );
    }

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const mapToEntity = this._dataMapper.toEntity(query.dto);
        const quotaCompanyId = new QuotaCompanyId(query.id);
        await mapToEntity.initializeUpdateSetId(quotaCompanyId);
        return await this._write.update(mapToEntity, manager);
      },
    );
  }
}
