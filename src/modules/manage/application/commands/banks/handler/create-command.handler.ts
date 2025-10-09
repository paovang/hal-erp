import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateBankCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import {
  BANK_IMAGE_FOLDER,
  WRITE_BANK_REPOSITORY,
} from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import { BankEntity } from '@src/modules/manage/domain/entities/bank.entity';
import { IWriteBankRepository } from '@src/modules/manage/domain/ports/output/bank-repository.interace';
import { BankDataMapper } from '../../../mappers/bank.mapper';
import { BankOrmEntity } from '@src/common/infrastructure/database/typeorm/bank.orm';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';

@CommandHandler(CreateBankCommand)
export class CreateBankCommandHandler
  implements IQueryHandler<CreateBankCommand, ResponseResult<BankEntity>>
{
  constructor(
    @Inject(WRITE_BANK_REPOSITORY)
    private readonly _write: IWriteBankRepository,
    private readonly _dataMapper: BankDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
  ) {}

  async execute(query: CreateBankCommand): Promise<ResponseResult<BankEntity>> {
    await _checkColumnDuplicate(
      BankOrmEntity,
      'name',
      query.dto.name,
      query.manager,
      'errors.name_already_exists',
    );
    await _checkColumnDuplicate(
      BankOrmEntity,
      'short_name',
      query.dto.short_name,
      query.manager,
      'errors.short_name_already_exists',
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
      logo: bankLogo ? bankLogo.fileKey : ' ',
    };
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const mapToEntity = this._dataMapper.toEntity(bankData);

        return await this._write.create(mapToEntity, manager);
      },
    );
  }
}
