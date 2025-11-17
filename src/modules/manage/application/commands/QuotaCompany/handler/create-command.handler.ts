import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { ProductEntity } from '@src/modules/manage/domain/entities/product.entity';
import { WRITE_QUOTA_COMPANY_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWriteQuotaCompanyRepository } from '@src/modules/manage/domain/ports/output/quota-company-repository.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ProductTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/product-type.orm';
import { UnitOrmEntity } from '@src/common/infrastructure/database/typeorm/unit.orm';
import { QuotaCompanyEntity } from '@src/modules/manage/domain/entities/quota-company.entity';
import { QuotaCompanyDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/quota-company.mapper';
import { QuotaCompanyDataMapper } from '../../../mappers/quota-company.mapper';
import { VendorProductOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor-product.orm';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<QuotaCompanyEntity>>
{
  constructor(
    @Inject(WRITE_QUOTA_COMPANY_REPOSITORY)
    private readonly _write: IWriteQuotaCompanyRepository,
    private readonly _dataMapper: QuotaCompanyDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<QuotaCompanyEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const user = this._userContextService.getAuthUser()?.user;
        const user_id = user.id;
        let company_id: number | null | undefined = null;
        const company_user = await findOneOrFail(
          query.manager,
          CompanyUserOrmEntity,
          {
            user_id: user_id,
          },
          `company user id ${user_id}`,
        );

        company_id = company_user.company_id;
        if (!company_id)
          throw new ManageDomainException(
            'errors.not_found',
            HttpStatus.NOT_FOUND,
            { property: `${company_id}` },
          );
        await findOneOrFail(
          manager,
          VendorProductOrmEntity,
          {
            id: query.dto.vendor_product_id,
          },
          `vendor product id ${query.dto.vendor_product_id}`,
        );
        await findOneOrFail(
          manager,
          CompanyOrmEntity,
          {
            id: company_id,
          },
          `company id ${company_id}`,
        );
        const mapToEntity = this._dataMapper.toEntity(query.dto, company_id);
        // const mapToEntity = this._dataMapper.toEntity(query.dto);
        return await this._write.create(mapToEntity, manager);
      },
    );
  }
}
