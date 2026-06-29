import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_COMPANY_PRODUCT_REPOSITORY } from '../../../constants/inject-key.const';
import { CompanyProductEntity } from '@src/modules/manage/domain/entities/company-product.entity';
import { IWriteCompanyProductRepository } from '@src/modules/manage/domain/ports/output/company-product-repository.interface';
import { CompanyProductDataMapper } from '../../../mappers/company-product.mapper';
import { CompanyProductOrmEntity } from '@src/common/infrastructure/database/typeorm/company-product.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyProductId } from '@src/modules/manage/domain/value-objects/company-product-id.vo';
import { ProductOrmEntity } from '@src/common/infrastructure/database/typeorm/product.orm';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<CompanyProductEntity>>
{
  constructor(
    @Inject(WRITE_COMPANY_PRODUCT_REPOSITORY)
    private readonly _write: IWriteCompanyProductRepository,
    private readonly _dataMapper: CompanyProductDataMapper,
  ) {}

  async execute(
    query: UpdateCommand,
  ): Promise<ResponseResult<CompanyProductEntity>> {
    await this.checkData(query);
    // Map to entity
    const entity = this._dataMapper.toEntity(query.dto);

    // Set and validate ID
    await entity.initializeUpdateSetId(new CompanyProductId(query.id));
    await entity.validateExistingIdForUpdate();

    // Final existence check for ID before update
    await findOneOrFail(query.manager, CompanyProductOrmEntity, {
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
      CompanyProductOrmEntity,
      {
        id: query.id,
      },
      `${query.id}`,
    );

    if (query.dto.product_id) {
      await findOneOrFail(
        query.manager,
        ProductOrmEntity,
        {
          id: query.dto.product_id,
        },
        `${query.dto.product_id}`,
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
