import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { Inject } from '@nestjs/common';
import { WRITE_APPROVAL_WORKFLOW_REPOSITORY } from '../../../constants/inject-key.const';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<ApprovalWorkflowEntity>>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowRepository,
    private readonly _dataMapper: ApprovalWorkflowDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
      id: query.dto.documentTypeId,
    });

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const mapToEntity = this._dataMapper.toEntity(query.dto);

        return await this._write.create(mapToEntity, manager);
      },
    );
  }
}
