import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_APPROVAL_WORKFLOW_REPOSITORY,
  WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { ApprovalWorkflowStepId } from '@src/modules/manage/domain/value-objects/approval-workflow-step-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { StatusEnum } from '@src/common/enums/status.enum';
import { ApproveDto } from '../../../dto/create/ApprovalWorkflow/approve.dto';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowStepRepository,
    @Inject(WRITE_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _writeWorkflow: IWriteApprovalWorkflowRepository,
    private readonly _dataMapperWorkflow: ApprovalWorkflowDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const step = await findOneOrFail(
          manager,
          ApprovalWorkflowStepOrmEntity,
          {
            id: query.id,
          },
        );

        const approval_id = (step as any).approval_workflow_id;

        const status = StatusEnum.PENDING;
        const dto = status as unknown as ApproveDto;

        const entityWork = this._dataMapperWorkflow.toEntityApprove(dto);
        await entityWork.initializeUpdateSetId(
          new ApprovalWorkflowId(approval_id),
        );
        await entityWork.validateExistingIdForUpdate();

        /** Check Exits Department Id */
        await findOneOrFail(manager, ApprovalWorkflowOrmEntity, {
          id: entityWork.getId().value,
        });

        await this._writeWorkflow.remove(entityWork, manager);

        await this.checkData(query);
        const workflow = await this._write.delete(
          new ApprovalWorkflowStepId(query.id),
          manager,
        );
        return workflow;
      },
    );
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    /** Check Exits BudgetAccountId Id */
    await findOneOrFail(query.manager, ApprovalWorkflowStepOrmEntity, {
      id: query.id,
    });
  }
}
