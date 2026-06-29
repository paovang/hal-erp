import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_COMPANY_PRODUCT_REPOSITORY,
  READ_COMPANY_PRODUCT_REPOSITORY,
} from '../../../constants/inject-key.const';
import { CompanyProductEntity } from '@src/modules/manage/domain/entities/company-product.entity';
import { IWriteCompanyProductRepository } from '@src/modules/manage/domain/ports/output/company-product-repository.interface';
import { IReadCompanyProductRepository } from '@src/modules/manage/domain/ports/output/company-product-repository.interface';
import { CompanyProductDataMapper } from '../../../mappers/company-product.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { CompanyProductOrmEntity } from '@src/common/infrastructure/database/typeorm/company-product.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { EligiblePersons } from '@src/modules/manage/application/constants/status-key.const';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<CompanyProductEntity>>
{
  constructor(
    @Inject(WRITE_COMPANY_PRODUCT_REPOSITORY)
    private readonly _write: IWriteCompanyProductRepository,
    @Inject(READ_COMPANY_PRODUCT_REPOSITORY)
    private readonly _read: IReadCompanyProductRepository,
    private readonly _dataMapper: CompanyProductDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    const { status } = query.dto;

    // Resolve the target company from the caller's auth context.
    // - admin / super-admin: must specify company_id in the body (they are not
    //   bound to a single company).
    // - everyone else: forced to their own company; the body company_id is ignored.
    const company_id = await this.resolveCompanyId(query);

    // company must exist
    await findOneOrFail(
      query.manager,
      CompanyOrmEntity,
      {
        id: company_id,
      },
      `${company_id}`,
    );

    const productIds = [...new Set(query.dto.product_ids)];
    const created: CompanyProductEntity[] = [];

    for (const product_id of productIds) {
      // each product must exist
      await findOneOrFail(
        query.manager,
        ProductOrmEntity,
        {
          id: product_id,
        },
        `${product_id}`,
      );

      // skip products already assigned (non-deleted) to this company so the
      // batch stays idempotent instead of failing on an existing pair
      const existing = await query.manager.findOne(CompanyProductOrmEntity, {
        where: {
          company_id,
          product_id,
        },
      });
      if (existing) {
        continue;
      }

      const entity = this._dataMapper.toEntity({
        company_id,
        product_id,
        status,
      });
      const result = await this._write.create(entity, query.manager);
      created.push(result as CompanyProductEntity);
    }

    return created;
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
        { property: 'company_id' },
      );
    }
    return company_id;
  }
}
