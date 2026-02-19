import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowStepEntity } from '@src/modules/manage/domain/entities/approval-workflow-step.entity';
import {
  WRITE_APPROVAL_WORKFLOW_REPOSITORY,
  WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { ApprovalWorkflowStepDataMapper } from '../../../mappers/approval-workflow-step.mapper';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { EnumWorkflowStep } from '../../../constants/status-key.const';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { DataSource, EntityManager } from 'typeorm';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';
import { StatusEnum } from '@src/common/enums/status.enum';
import { ApproveDto } from '../../../dto/create/ApprovalWorkflow/approve.dto';
import { TRANSACTION_MANAGER_SERVICE } from '@src/common/constants/inject-key.const';
import { InjectDataSource } from '@nestjs/typeorm';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<ApprovalWorkflowStepEntity>>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _writeStep: IWriteApprovalWorkflowStepRepository,
    private readonly _dataMapperStep: ApprovalWorkflowStepDataMapper,
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
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        let mergeData: any = null;

        await this.checkData(query);

        const steps = await manager.find(ApprovalWorkflowStepOrmEntity, {
          where: { approval_workflow_id: query.id },
        });

        await this.checkStep(manager, query.id, query);

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

        const step = this._dataMapperStep.toEntity(mergeData, query.id);
        const res = await this._writeStep.create(step, manager);

        const status = StatusEnum.PENDING;
        const dto = status as unknown as ApproveDto;

        const entity = this._dataMapper.toEntityApprove(dto);
        await entity.initializeUpdateSetId(new ApprovalWorkflowId(query.id));
        await entity.validateExistingIdForUpdate();

        /** Check Exits Department Id */
        await findOneOrFail(manager, ApprovalWorkflowOrmEntity, {
          id: entity.getId().value,
        });

        await this._write.pending(entity, manager);

        return res;
      },
    );
  }

  private async checkData(query: CreateCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
    await findOneOrFail(query.manager, ApprovalWorkflowOrmEntity, {
      id: query.id,
    });
  }

  private async checkStep(
    manager: EntityManager,
    workflow_id: number,
    query: CreateCommand,
  ): Promise<void> {
    // ✅ Get current max step_number in DB for this workflow
    const existingMaxStepNumber = await manager
      .getRepository(ApprovalWorkflowStepOrmEntity)
      .createQueryBuilder('step')
      .select('MAX(step.step_number)', 'max')
      .where('step.approval_workflow_id = :workflowId', {
        workflowId: workflow_id,
      })
      .getRawOne();

    const maxStepNumber = existingMaxStepNumber?.max
      ? Number(existingMaxStepNumber.max)
      : 0;

    // ✅ Ensure new step(s) start with max + 1
    if (query.dto.step_number !== maxStepNumber + 1) {
      throw new ManageDomainException(
        'errors.invalid_step_number',
        HttpStatus.BAD_REQUEST,
        {
          property: `${maxStepNumber + 1}`,
        },
      );
    }
  }
}
