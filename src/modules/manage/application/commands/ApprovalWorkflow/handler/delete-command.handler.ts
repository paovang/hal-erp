import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DeleteCommand } from '../delete.command';
import {
  WRITE_APPROVAL_WORKFLOW_REPOSITORY,
  WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';
import { IWriteApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { ApprovalWorkflowStepDataMapper } from '../../../mappers/approval-workflow-step.mapper';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { ApprovalWorkflowStepId } from '@src/modules/manage/domain/value-objects/approval-workflow-step-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowRepository,
    @Inject(WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _writeStep: IWriteApprovalWorkflowStepRepository,
    private readonly _dataMapperStep: ApprovalWorkflowStepDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    await this.checkData(query);
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const steps = await manager.find(ApprovalWorkflowStepOrmEntity, {
          where: { approval_workflow_id: query.id },
        });

        for (const step of steps) {
          await this._writeStep.delete(
            new ApprovalWorkflowStepId(step.id),
            manager,
          );
        }

        return await this._write.delete(
          new ApprovalWorkflowId(query.id),
          manager,
        );
      },
    );
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    /** Check Exits ApprovalWorkflowId Id */
    await findOneOrFail(query.manager, ApprovalWorkflowOrmEntity, {
      id: query.id,
    });
  }
}
