import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_COMPANY_VENDOR_REPOSITORY,
  READ_COMPANY_VENDOR_REPOSITORY,
} from '../../../constants/inject-key.const';
import { CompanyVendorEntity } from '@src/modules/manage/domain/entities/company-vendor.entity';
import { IWriteCompanyVendorRepository } from '@src/modules/manage/domain/ports/output/company-vendor-repository.interface';
import { IReadCompanyVendorRepository } from '@src/modules/manage/domain/ports/output/company-vendor-repository.interface';
import { CompanyVendorDataMapper } from '../../../mappers/company-vendor.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { VendorOrmEntity } from '@src/common/infrastructure/database/typeorm/vendor.orm';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { CompanyVendorOrmEntity } from '@src/common/infrastructure/database/typeorm/company-vendor.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<CompanyVendorEntity>>
{
  constructor(
    @Inject(WRITE_COMPANY_VENDOR_REPOSITORY)
    private readonly _write: IWriteCompanyVendorRepository,
    @Inject(READ_COMPANY_VENDOR_REPOSITORY)
    private readonly _read: IReadCompanyVendorRepository,
    private readonly _dataMapper: CompanyVendorDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<CompanyVendorEntity>> {
    const { vendor_id, status, credit_term_days, credit_limit, payment_term } =
      query.dto;

    // Resolve the target company from auth: admin must pass company_id;
    // non-admin is forced to their own company.
    const company_id = await this.resolveCompanyId(query);

    // vendor + company must exist
    await findOneOrFail(
      query.manager,
      VendorOrmEntity,
      { id: vendor_id },
      `${vendor_id}`,
    );
    await findOneOrFail(
      query.manager,
      CompanyOrmEntity,
      { id: company_id },
      `${company_id}`,
    );

    // prevent duplicate (company, vendor) pair while not soft-deleted
    const existing = await query.manager.findOne(CompanyVendorOrmEntity, {
      where: {
        company_id,
        vendor_id,
      },
    });
    if (existing) {
      throw new ManageDomainException(
        'errors.already_exists',
        HttpStatus.CONFLICT,
        { property: `${vendor_id}` },
      );
    }

    const entity = this._dataMapper.toEntity({
      company_id,
      vendor_id,
      status,
      credit_term_days,
      credit_limit,
      payment_term,
    });
    return await this._write.create(entity, query.manager);
  }

  private async resolveCompanyId(query: CreateCommand): Promise<number> {
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user?.id;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];
    const isAdmin =
      roles.includes(EligiblePersons.SUPER_ADMIN) ||
      roles.includes(EligiblePersons.ADMIN);

    if (isAdmin) {
      if (!query.dto.company_id) {
        throw new ManageDomainException(
          'errors.is_required',
          HttpStatus.BAD_REQUEST,
          { property: 'company_id' },
        );
      }
      return query.dto.company_id;
    }

    // non-admin: scope to their own company, ignore any body company_id
    const company_user = await query.manager.findOne(CompanyUserOrmEntity, {
      where: {
        user_id: user_id,
      },
    });
    const company_id = company_user?.company_id ?? undefined;
    if (!company_id) {
      throw new ManageDomainException(
        'errors.forbidden',
        HttpStatus.FORBIDDEN,
        {
          property: 'company_id',
        },
      );
    }
    return company_id;
  }
}
