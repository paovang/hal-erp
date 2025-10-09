import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateBankCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import {
  BANK_IMAGE_FOLDER,
  WRITE_BANK_REPOSITORY,
} from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { BankId } from '@src/modules/manage/domain/value-objects/bank-id.vo';
import { BankOrmEntity } from '@src/common/infrastructure/database/typeorm/bank.orm';
import { BankEntity } from '@src/modules/manage/domain/entities/bank.entity';
import { BankDataMapper } from '../../../mappers/bank.mapper';
import { IWriteBankRepository } from '@src/modules/manage/domain/ports/output/bank-repository.interace';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY } from '@src/common/constants/inject-key.const';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';

@CommandHandler(UpdateBankCommand)
export class UpdateBankCommandHandler
  implements IQueryHandler<UpdateBankCommand, ResponseResult<BankEntity>>
{
  constructor(
    @Inject(WRITE_BANK_REPOSITORY)
    private readonly _write: IWriteBankRepository,
    private readonly _dataMapper: BankDataMapper,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
  ) {}

  async execute(query: UpdateBankCommand): Promise<ResponseResult<BankEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
    await _checkColumnDuplicate(
      BankOrmEntity,
      'name',
      query.dto.name,
      query.manager,
      'errors.name_already_exists',
      query.id,
    );

    await _checkColumnDuplicate(
      BankOrmEntity,
      'short_name',
      query.dto.short_name,
      query.manager,
      'errors.short_name_already_exists',
      query.id,
    );
    const optimizedLogo = query.logo
      ? await this._optimizeService.optimizeImage(query.logo)
      : '';

    const bankLogo = optimizedLogo
      ? await this._amazonS3ServiceKey.uploadFile(
          optimizedLogo,
          BANK_IMAGE_FOLDER,
        )
      : '';
    const bankData = {
      ...query.dto,
      logo: bankLogo ? bankLogo.fileKey : '',
    };

    const entity = this._dataMapper.toEntity(bankData);
    await entity.initializeUpdateSetId(new BankId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, BankOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
