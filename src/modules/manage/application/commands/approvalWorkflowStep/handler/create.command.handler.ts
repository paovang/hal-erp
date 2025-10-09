import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { CreateCommand } from '../create.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowStepEntity } from '@src/modules/manage/domain/entities/approval-workflow-step.entity';
import { WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY } from '../../../constants/inject-key.const';
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
import { EntityManager } from 'typeorm';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements
    IQueryHandler<CreateCommand, ResponseResult<ApprovalWorkflowStepEntity>>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _writeStep: IWriteApprovalWorkflowStepRepository,
    private readonly _dataMapperStep: ApprovalWorkflowStepDataMapper,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    let mergeData: any = null;

    await this.checkData(query);

    const steps = await query.manager.find(ApprovalWorkflowStepOrmEntity, {
      where: { approval_workflow_id: query.id },
    });

    await this.checkStep(query.manager, query.id, query);

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
      await findOneOrFail(query.manager, DepartmentOrmEntity, {
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
      await findOneOrFail(query.manager, UserOrmEntity, {
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
    return await this._writeStep.create(step, query.manager);
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
