import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CurrencyEntity } from '@src/modules/manage/domain/entities/currency.entity';
import { WRITE_CURRENCY_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteCurrencyRepository } from '@src/modules/manage/domain/ports/output/currency-repository.interface';
import { CurrencyDataMapper } from '../../../mappers/currency.mapper';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { CurrencyOrmEntity } from '@src/common/infrastructure/database/typeorm/currency.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CurrencyId } from '@src/modules/manage/domain/value-objects/currency-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<CurrencyEntity>>
{
  constructor(
    @Inject(WRITE_CURRENCY_REPOSITORY)
    private readonly _write: IWriteCurrencyRepository,
    private readonly _dataMapper: CurrencyDataMapper,
  ) {}

  async execute(query: UpdateCommand): Promise<ResponseResult<CurrencyEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await _checkColumnDuplicate(
      CurrencyOrmEntity,
      'code',
      query.dto.code,
      query.manager,
      'errors.code_already_exists',
      query.id,
    );

    await _checkColumnDuplicate(
      CurrencyOrmEntity,
      'name',
      query.dto.name,
      query.manager,
      'errors.name_already_exists',
      query.id,
    );

    const entity = this._dataMapper.toEntity(query.dto);
    await entity.initializeUpdateSetId(new CurrencyId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, CurrencyOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
