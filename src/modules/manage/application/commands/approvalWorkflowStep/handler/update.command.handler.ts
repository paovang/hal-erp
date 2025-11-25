import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
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
import { DataSource, EntityManager, Not } from 'typeorm';
import { EnumWorkflowStep } from '../../../constants/status-key.const';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { StatusEnum } from '@src/common/enums/status.enum';
import { ApproveDto } from '../../../dto/create/ApprovalWorkflow/approve.dto';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { InjectDataSource } from '@nestjs/typeorm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements
    IQueryHandler<UpdateCommand, ResponseResult<ApprovalWorkflowStepEntity>>
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

  async execute(query: UpdateCommand): Promise<any> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let mergeData: any = null;

        await this.checkData(query);

        const data = await findOneOrFail(
          manager,
          ApprovalWorkflowStepOrmEntity,
          {
            id: query.id,
          },
        );
        const approval_id = (data as any).approval_workflow_id;
        const steps = await manager.find(ApprovalWorkflowStepOrmEntity, {
          where: { approval_workflow_id: approval_id, id: Not(query.id) },
        });

        // await this.checkStep(query.manager, approval_id, query);

        for (const step of steps) {
          if (step.step_number === query.dto.step_number) {
            throw new ManageDomainException(
              'errors.step_number_exist',
              HttpStatus.BAD_REQUEST,
              { property: `${query.dto.step_number}` },
            );
          }
        }

        if (query.dto.type === EnumWorkflowStep.DEPARTMENT) {
          if (!query.dto.departmentId) {
            throw new ManageDomainException(
              'errors.is_required',
              HttpStatus.BAD_REQUEST,
              { property: 'departmentId' },
            );
          }
          await findOneOrFail(manager, DepartmentOrmEntity, {
            id: query.dto.departmentId,
          });

          mergeData = {
            ...query.dto,
            department_id: query.dto.departmentId,
            userId: null,
          };
        } else if (query.dto.type === EnumWorkflowStep.SPECIFIC_USER) {
          if (!query.dto.userId) {
            throw new ManageDomainException(
              'errors.is_required',
              HttpStatus.BAD_REQUEST,
              { property: 'userId' },
            );
          }
          await findOneOrFail(manager, UserOrmEntity, {
            id: query.dto.userId,
          });

          mergeData = {
            ...query.dto,
            departmentId: null,
            userId: query.dto.userId,
          };
        } else {
          mergeData = {
            ...query.dto,
            department_id: null,
            userId: null,
          };
        }

        const entity = this._dataMapper.toEntity(mergeData);
        await entity.initializeUpdateSetId(
          new ApprovalWorkflowStepId(query.id),
        );
        await entity.validateExistingIdForUpdate();

        /** Check Exits Department Id */
        await findOneOrFail(manager, ApprovalWorkflowStepOrmEntity, {
          id: entity.getId().value,
        });

        const res = await this._write.update(entity, manager);

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

        await this._writeWorkflow.rejected(entityWork, manager);

        return res;
      },
    );
  }

  private async checkData(query: UpdateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
  }

  private async checkStep(
    manager: EntityManager,
    workflow_id: number,
    query: UpdateCommand,
  ): Promise<void> {
    // ✅ Get current max step_number in DB for this workflow
    const existingMaxStepNumber = await manager
      .getRepository(ApprovalWorkflowStepOrmEntity)
      .createQueryBuilder('step')
      .select('MAX(step.step_number)', 'max')
      .where('step.approval_workflow_id = :workflowId', {
        workflowId: workflow_id,
      })
      .andWhere('step.id != :id', { id: query.id })
      .getRawOne();

    console.log('object', existingMaxStepNumber);

    const maxStepNumber = existingMaxStepNumber?.max
      ? Number(existingMaxStepNumber.max)
      : 0;

    if (query.dto.step_number !== maxStepNumber) {
      throw new ManageDomainException(
        'errors.invalid_step_number',
        HttpStatus.BAD_REQUEST,
        {
          property: `${maxStepNumber}`,
        },
      );
    }
  }
}
