import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { UpdateCommand } from '../update.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowStepEntity } from '@src/modules/manage/domain/entities/approval-workflow-step.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY } from '../../../constants/inject-key.const';
import { IWriteApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { ApprovalWorkflowStepDataMapper } from '../../../mappers/approval-workflow-step.mapper';
import { ApprovalWorkflowStepId } from '@src/modules/manage/domain/value-objects/approval-workflow-step-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { EntityManager, Not } from 'typeorm';
import { EnumWorkflowStep } from '../../../constants/status-key.const';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements
    IQueryHandler<UpdateCommand, ResponseResult<ApprovalWorkflowStepEntity>>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowStepRepository,
    private readonly _dataMapper: ApprovalWorkflowStepDataMapper,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    let mergeData: any = null;

    await this.checkData(query);

    const data = await findOneOrFail(
      query.manager,
      ApprovalWorkflowStepOrmEntity,
      {
        id: query.id,
      },
    );
    const approval_id = (data as any).approval_workflow_id;
    const steps = await query.manager.find(ApprovalWorkflowStepOrmEntity, {
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

    const entity = this._dataMapper.toEntity(mergeData);
    await entity.initializeUpdateSetId(new ApprovalWorkflowStepId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, ApprovalWorkflowStepOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
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
