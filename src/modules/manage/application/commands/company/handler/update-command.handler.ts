import { UpdateCommand } from '@src/modules/manage/application/commands/company/update.command';
import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import {
  WRITE_COMPANY_REPOSITORY,
  READ_COMPANY_REPOSITORY,
  COMPANY_LOGO_FOLDER,
} from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { CompanyEntity } from '@src/modules/manage/domain/entities/company.entity';
import {
  IWriteCompanyRepository,
  IReadCompanyRepository,
} from '@src/modules/manage/domain/ports/output/company-repository.interface';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { CompanyDataMapper } from '@src/modules/manage/application/mappers/company.mapper';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { CompanyId } from '@src/modules/manage/domain/value-objects/company-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyOrmEntity } from '@src/common/infrastructure/database/typeorm/company.orm';
import { _checkColumnDuplicate } from '@src/common/utils/check-column-duplicate-orm.util';
import path from 'path';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<CompanyEntity>>
{
  constructor(
    @Inject(READ_COMPANY_REPOSITORY)
    private readonly _read: IReadCompanyRepository,
    @Inject(WRITE_COMPANY_REPOSITORY)
    private readonly _write: IWriteCompanyRepository,
    private readonly _dataMapper: CompanyDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async execute(
    command: UpdateCommand,
  ): Promise<ResponseResult<CompanyEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        await this.checkData(command, manager);

        let processedItems = null;
        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );
        let fileKey = null;
        if (command.dto.logo) {
          const mockFile = await createMockMulterFile(
            baseFolder,
            command.dto.logo,
          );
          const optimizedImage =
            await this._optimizeService.optimizeImage(mockFile);
          const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
            optimizedImage,
            COMPANY_LOGO_FOLDER,
          );
          fileKey = s3ImageResponse.fileKey;
        }

        processedItems = {
          ...command.dto,
          logo: fileKey ?? undefined,
        };

        const companyId = new CompanyId(command.id);

        const mapToEntity = this._dataMapper.toEntity(processedItems);
        mapToEntity.initializeUpdateSetId(companyId);

        return await this._write.update(mapToEntity, manager);
      },
    );
  }

  private async checkData(
    command: UpdateCommand,
    manager: EntityManager,
  ): Promise<void> {
    await findOneOrFail(
      manager,
      CompanyOrmEntity,
      {
        id: command.id,
      },
      `id ${command.id}`,
    );
    await _checkColumnDuplicate(
      CompanyOrmEntity,
      'name',
      command.dto.name,
      manager,
      'errors.name_already_exists',
      command.id,
    );
    await _checkColumnDuplicate(
      CompanyOrmEntity,
      'email',
      command.dto.email,
      manager,
      'errors.email_already_exists',
      command.id,
    );
    await _checkColumnDuplicate(
      CompanyOrmEntity,
      'tel',
      command.dto.tel,
      manager,
      'errors.tel_already_exists',
      command.id,
    );
  }
}
