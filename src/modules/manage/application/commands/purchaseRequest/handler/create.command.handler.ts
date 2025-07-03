import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseRequestEntity } from '@src/modules/manage/domain/entities/purchase-request.entity';
import { Inject, HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import {
  LENGTH_DOCUMENT_CODE,
  LENGTH_PURCHASE_REQUEST_CODE,
  PR_FILE_NAME_FOLDER,
  WRITE_DOCUMENT_REPOSITORY,
  WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY,
  WRITE_PURCHASE_REQUEST_REPOSITORY,
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWritePurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { PurchaseRequestDataMapper } from '../../../mappers/purchase-request.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PurchaseRequestOrmEntity } from '@src/common/infrastructure/database/typeorm/purchase-request.orm';
import { CodeGeneratorUtil } from '@src/common/utils/code-generator.util';
import {
  TRANSACTION_MANAGER_SERVICE,
  USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { UnitOrmEntity } from '@src/common/infrastructure/database/typeorm/unit.orm';
import path from 'path';
import { createMockMulterFile } from '@src/common/utils/services/file-utils.service';
import { IImageOptimizeService } from '@src/common/utils/services/images/interface/image-optimize-service.interface';
import { AMAZON_S3_SERVICE_KEY } from '@src/common/infrastructure/aws3/config/inject-key';
import { IAmazonS3ImageService } from '@src/common/infrastructure/aws3/interface/amazon-s3-image-service.interface';
import { PurchaseRequestItemDataMapper } from '../../../mappers/purchase-request-item.mapper';
import { IWritePurchaseRequestItemRepository } from '@src/modules/manage/domain/ports/output/purchase-request-item-repository.interface';
import { IWriteDocumentRepository } from '@src/modules/manage/domain/ports/output/document-repository.interface';
import { DocumentDataMapper } from '../../../mappers/document.mapper';
import moment from 'moment-timezone';
import { Timezone } from '@src/common/domain/value-objects/timezone.vo';
import { DocumentOrmEntity } from '@src/common/infrastructure/database/typeorm/document.orm';
import { DocumentEntityMode } from '@src/common/utils/orm-entity-method.enum';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { UserApprovalDataMapper } from '../../../mappers/user-approval.mapper';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
import { ApprovalDto } from '../../../dto/create/userApprovalStep/update-statue.dto';
import { STATUS_KEY } from '../../../constants/status-key.const';
import { CreateUserApprovalDto } from '../../../dto/create/userApproval/create.dto';
import { deleteFile } from '@src/common/utils/file.utils';

interface CustomApprovalDto extends ApprovalDto {
  user_approval_id: number;
  approval_workflow_step_id: number;
}

interface CustomUserApprovalDto extends CreateUserApprovalDto {
  status: number;
}

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<PurchaseRequestEntity>>
{
  constructor(
    @Inject(WRITE_PURCHASE_REQUEST_REPOSITORY)
    private readonly _write: IWritePurchaseRequestRepository,
    private readonly _dataMapper: PurchaseRequestDataMapper,
    private readonly _codeGeneratorUtil: CodeGeneratorUtil,
    // item
    @Inject(WRITE_PURCHASE_REQUEST_ITEM_REPOSITORY)
    private readonly _writeItem: IWritePurchaseRequestItemRepository,
    private readonly _dataItemMapper: PurchaseRequestItemDataMapper,
    // document
    @Inject(WRITE_DOCUMENT_REPOSITORY)
    private readonly _writeD: IWriteDocumentRepository,
    private readonly _dataDMapper: DocumentDataMapper,
    // user approval
    @Inject(WRITE_USER_APPROVAL_REPOSITORY)
    private readonly _writeUserApproval: IWriteUserApprovalRepository,
    private readonly _dataUserApprovalMapper: UserApprovalDataMapper,
    // user approval step
    @Inject(WRITE_USER_APPROVAL_STEP_REPOSITORY)
    private readonly _writeUserApprovalStep: IWriteUserApprovalStepRepository,
    private readonly _dataUserApprovalMapperStep: UserApprovalStepDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
    private readonly _userContextService: UserContextService,
    @Inject(USER_PROFILE_IMAGE_FILE_OPTIMIZE_SERVICE_KEY)
    private readonly _optimizeService: IImageOptimizeService,
    @Inject(AMAZON_S3_SERVICE_KEY)
    private readonly _amazonS3ServiceKey: IAmazonS3ImageService,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<PurchaseRequestEntity>> {
    const expiredDateFormatted = moment(query.dto.expired_date).format(
      'YYYY-MM-DD',
    );

    if (expiredDateFormatted.includes('Invalid date')) {
      throw new ManageDomainException(
        'errors.expired_date_invalid',
        HttpStatus.BAD_REQUEST,
      );
    }

    const expiredDate = moment.tz(query.dto.expired_date, Timezone.LAOS);

    const today = moment.tz(Timezone.LAOS).startOf('day');

    if (expiredDate.isBefore(today)) {
      throw new ManageDomainException(
        'errors.expired_date_must_not_be_in_past',
        HttpStatus.BAD_REQUEST,
      );
    }

    const pr_code = await this._codeGeneratorUtil.generateUniqueCode(
      LENGTH_PURCHASE_REQUEST_CODE,
      async (generatedCode: string) => {
        try {
          await findOneOrFail(query.manager, PurchaseRequestOrmEntity, {
            pr_number: generatedCode,
          });
          return false;
        } catch {
          return true;
        }
      },
      'PR',
    );

    const document_number = await this._codeGeneratorUtil.generateUniqueCode(
      LENGTH_DOCUMENT_CODE,
      async (generatedCode: string) => {
        try {
          await findOneOrFail(query.manager, DocumentOrmEntity, {
            document_number: generatedCode,
          });
          return false;
        } catch {
          return true;
        }
      },
      'D',
    );

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let processedItems = null;
        let sum_total = 0;

        const baseFolder = path.join(
          __dirname,
          '../../../../../../../assets/uploads/',
        );

        const user_id = this._userContextService.getAuthUser()?.user.id;

        const department = await findOneOrFail(
          query.manager,
          DepartmentUserOrmEntity,
          {
            user_id: user_id,
          },
        );

        const department_id = (department as any).department_id;

        const DEntity = this._dataDMapper.toEntity(
          query.dto.document,
          DocumentEntityMode.CREATE,
          document_number,
          user_id,
          department_id,
        );

        const D = await this._writeD.create(DEntity, manager);

        const document_id = (D as any)._id._value;

        const entity = this._dataMapper.toEntity(
          query.dto,
          pr_code,
          document_id,
        );

        const pr = await this._write.create(entity, manager);

        const pr_id = (pr as any)._id._value;

        for (const item of query.dto.purchase_request_items) {
          await findOneOrFail(query.manager, UnitOrmEntity, {
            id: item.unit_id,
          });

          let fileKey = null;
          if (item.file_name) {
            const mockFile = await createMockMulterFile(
              baseFolder,
              item.file_name,
            );
            const optimizedImage =
              await this._optimizeService.optimizeImage(mockFile);
            const s3ImageResponse = await this._amazonS3ServiceKey.uploadFile(
              optimizedImage,
              PR_FILE_NAME_FOLDER,
            );
            fileKey = s3ImageResponse.fileKey;
          }

          processedItems = {
            ...item,
            file_name: fileKey,
          };

          sum_total = item.quantity * item.price;

          const pr_item = this._dataItemMapper.toEntity(
            processedItems,
            pr_id,
            sum_total,
          );

          await this._writeItem.create(pr_item, manager);
        }

        const approval_workflow = await findOneOrFail(
          manager,
          ApprovalWorkflowOrmEntity,
          {
            document_type_id: query.dto.document.documentTypeId,
          },
        );

        const aw_id = (approval_workflow as any).id;

        const a_w_s = await query.manager.findOne(
          ApprovalWorkflowStepOrmEntity,
          {
            where: { approval_workflow_id: aw_id },
            order: { step_number: 'ASC' },
          },
        );

        const merge: CustomUserApprovalDto = {
          documentId: document_id,
          status: STATUS_KEY.PENDING,
        };

        const user_approval_entity = this._dataUserApprovalMapper.toEntity(
          merge,
          aw_id,
        );

        const user_approval = await this._writeUserApproval.create(
          user_approval_entity,
          manager,
        );

        const ua_id = (user_approval as any)._id._value;

        const pendingDto: CustomApprovalDto = {
          user_approval_id: ua_id,
          approval_workflow_step_id: a_w_s!.id,
          statusId: STATUS_KEY.PENDING,
          remark: null,
          // type: 'pr',
        };
        const aw_step =
          this._dataUserApprovalMapperStep.toEntityForInsert(pendingDto);
        await this._writeUserApprovalStep.create(aw_step, manager);

        // await this.deleteFileInFolder(query, baseFolder);

        return pr;
      },
    );
  }

  private async deleteFileInFolder(
    query: CreateCommand,
    baseFolder: string,
  ): Promise<any> {
    for (const file of query.dto.purchase_request_items) {
      const filePath = file.file_name;
      if (filePath) {
        const Path = baseFolder + filePath;

        await deleteFile(Path);
      }
    }
  }
}
