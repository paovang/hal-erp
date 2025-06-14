import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_APPROVAL_WORKFLOW_REPOSITORY,
  WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DocumentTypeOrmEntity } from '@src/common/infrastructure/database/typeorm/document-type.orm';
import { IWriteApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { ApprovalWorkflowStepDataMapper } from '../../../mappers/approval-workflow-step.mapper';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<ApprovalWorkflowEntity>>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowRepository,
    private readonly _dataMapper: ApprovalWorkflowDataMapper,
    @Inject(WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _writeStep: IWriteApprovalWorkflowStepRepository,
    private readonly _dataMapperStep: ApprovalWorkflowStepDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    const seen = new Set<number>();
    const duplicates = new Set<number>();

    await findOneOrFail(query.manager, DocumentTypeOrmEntity, {
      id: query.dto.documentTypeId,
    });

    for (const step of query.dto.steps) {
      await findOneOrFail(query.manager, DepartmentOrmEntity, {
        id: step.departmentId,
      });
    }

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const mapToEntity = this._dataMapper.toEntity(query.dto);

        const result = await this._write.create(mapToEntity, manager);
        const workflow_id = (result as any)._id._value;

        for (const step of query.dto.steps) {
          if (seen.has(step.step_number)) {
            duplicates.add(step.step_number);
          } else {
            seen.add(step.step_number);
          }

          const mapToEntityDetail = this._dataMapperStep.toEntity(
            step,
            workflow_id,
          );
          await this._writeStep.create(mapToEntityDetail, manager);
        }

        if (duplicates.size > 0) {
          throw new ManageDomainException(
            'errors.duplicate_step_number',
            HttpStatus.BAD_REQUEST,
          );
        }

        return result;
      },
    );
  }
}
