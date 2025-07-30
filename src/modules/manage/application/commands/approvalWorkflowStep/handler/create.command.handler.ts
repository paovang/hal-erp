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
    await this.checkData(query);

    const steps = await query.manager.find(ApprovalWorkflowStepOrmEntity, {
      where: { approval_workflow_id: query.id },
    });

    for (const step of steps) {
      if (step.step_number === query.dto.step_number) {
        throw new ManageDomainException(
          'errors.step_number_exist',
          HttpStatus.BAD_REQUEST,
          { property: `${query.dto.step_number}` },
        );
      }
    }

    const step = this._dataMapperStep.toEntity(query.dto, query.id);
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

    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.dto.departmentId,
    });
  }
}
