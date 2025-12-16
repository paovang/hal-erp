import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowStepEntity } from '@src/modules/manage/domain/entities/approval-workflow-step.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_APPROVAL_WORKFLOW_REPOSITORY,
  WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { ApprovalWorkflowStepDataMapper } from '../../../mappers/approval-workflow-step.mapper';
import { ApprovalWorkflowStepId } from '@src/modules/manage/domain/value-objects/approval-workflow-step-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { DataSource } from 'typeorm';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { StatusEnum } from '@src/common/enums/status.enum';
import { ApproveDto } from '../../../dto/create/ApprovalWorkflow/approve.dto';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';
import { OrderByCommand } from '../order-by.command';

@CommandHandler(OrderByCommand)
export class OrderByCommandHandler
  implements
    IQueryHandler<OrderByCommand, ResponseResult<ApprovalWorkflowStepEntity>>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowStepRepository,
    private readonly _dataMapper: ApprovalWorkflowStepDataMapper,
    @Inject(WRITE_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _writeWorkflow: IWriteApprovalWorkflowRepository,
    private readonly _dataMapperWorkflow: ApprovalWorkflowDataMapper,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(query: OrderByCommand): Promise<any> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let res: any;
        await this.checkData(query);

        await findOneOrFail(manager, ApprovalWorkflowOrmEntity, {
          id: query.id,
        });

        let step = 1;

        for (const item of query.dto.ids) {
          await findOneOrFail(
            manager,
            ApprovalWorkflowStepOrmEntity,
            {
              id: item,
            },
            `approval workflow step id = ${item}`,
          );
          const entity = this._dataMapper.toEntityOrderBy(step);

          await entity.initializeUpdateSetId(new ApprovalWorkflowStepId(item));

          await entity.validateExistingIdForUpdate();

          await findOneOrFail(manager, ApprovalWorkflowStepOrmEntity, {
            id: entity.getId().value,
          });

          res = await this._write.orderBy(entity, manager);

          step++;
        }

        const status = StatusEnum.PENDING;
        const dto = status as unknown as ApproveDto;

        const entityWork = this._dataMapperWorkflow.toEntityApprove(dto);
        await entityWork.initializeUpdateSetId(
          new ApprovalWorkflowId(query.id),
        );
        await entityWork.validateExistingIdForUpdate();

        /** Check Exits Department Id */
        await findOneOrFail(manager, ApprovalWorkflowOrmEntity, {
          id: entityWork.getId().value,
        });

        await this._writeWorkflow.rejected(entityWork, manager);

        return res;
      },
    );
  }

  private async checkData(query: OrderByCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
  }
}
