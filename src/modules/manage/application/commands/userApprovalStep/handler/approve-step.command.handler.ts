import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { ApproveStepCommand } from '../approve-step.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { UserApprovalStepEntity } from '@src/modules/manage/domain/entities/user-approval-step.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import {
  WRITE_USER_APPROVAL_REPOSITORY,
  WRITE_USER_APPROVAL_STEP_REPOSITORY,
} from '../../../constants/inject-key.const';
import { IWriteUserApprovalStepRepository } from '@src/modules/manage/domain/ports/output/user-approval-step-repository.interface';
import { UserApprovalStepDataMapper } from '../../../mappers/user-approval-step.mapper';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { UserApprovalStepOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval-step.orm';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { STATUS_KEY } from '../../../constants/status-key.const';
import { ApprovalDto } from '../../../dto/create/userApprovalStep/update-statue.dto';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserApprovalDataMapper } from '../../../mappers/user-approval.mapper';
import { IWriteUserApprovalRepository } from '@src/modules/manage/domain/ports/output/user-approval-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserApprovalId } from '@src/modules/manage/domain/value-objects/user-approval-id.vo';
import { UserApprovalOrmEntity } from '@src/common/infrastructure/database/typeorm/user-approval.orm';

interface CustomApprovalDto extends ApprovalDto {
  user_approval_id: number;
  approval_workflow_step_id: number;
  statusId: number;
}

interface UpdateUserApprovalStatusDto {
  status: number;
}

@CommandHandler(ApproveStepCommand)
export class ApproveStepCommandHandler
  implements
    IQueryHandler<ApproveStepCommand, ResponseResult<UserApprovalStepEntity>>
{
  constructor(
    @Inject(WRITE_USER_APPROVAL_STEP_REPOSITORY)
    private readonly _write: IWriteUserApprovalStepRepository,
    private readonly _dataMapper: UserApprovalStepDataMapper,
    @Inject(WRITE_USER_APPROVAL_REPOSITORY)
    private readonly _writeUA: IWriteUserApprovalRepository,
    private readonly _dataUAMapper: UserApprovalDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: ApproveStepCommand,
  ): Promise<ResponseResult<UserApprovalStepEntity>> {
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user?.id;

    if (isNaN(query.stepId)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkApproval = await query.manager.findOne(
      UserApprovalStepOrmEntity,
      {
        where: { id: query.stepId },
      },
    );

    if (checkApproval && checkApproval.status_id === STATUS_KEY.APPROVED) {
      throw new ManageDomainException(
        'errors.already_approved',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 1. หา step ปัจจุบัน
    const step = await query.manager.findOne(UserApprovalStepOrmEntity, {
      where: { id: query.stepId },
      relations: ['user_approvals', 'approval_workflow_steps'],
    });

    if (!step)
      throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND);

    // 2. อัปเดต step ปัจจุบันเป็น approved
    const entity = this._dataMapper.toEntity(query.dto, user_id, query.stepId);
    await this._write.update(entity, query.manager, query.stepId);

    // 3. หา next step (ถ้ามี)
    const currentStepNumber = step.approval_workflow_steps?.step_number;
    const workflowId = step.approval_workflow_steps.approval_workflow_id;
    const nextStep = await query.manager.findOne(
      ApprovalWorkflowStepOrmEntity,
      {
        where: {
          approval_workflow_id: workflowId,
          step_number: currentStepNumber! + 1,
        },
      },
    );

    // 4. ถ้ามี next step ให้สร้าง step pending ใหม่
    if (nextStep) {
      const pendingDto: CustomApprovalDto = {
        user_approval_id: step.user_approvals.id,
        approval_workflow_step_id: nextStep.id,
        statusId: STATUS_KEY.PENDING,
        remark: null,
        // type: 'pr',
      };

      const pendingEntity = this._dataMapper.toEntityForInsert(pendingDto);
      // do NOT pass the step id as the third argument
      await this._write.create(pendingEntity, query.manager);
    }

    const checkStepStatus = await query.manager.findOne(
      UserApprovalStepOrmEntity,
      {
        where: {
          user_approval_id: step.user_approvals.id,
          status_id: STATUS_KEY.PENDING,
        },
      },
    );

    if (!checkStepStatus) {
      const updateStatus: UpdateUserApprovalStatusDto = {
        status: STATUS_KEY.APPROVED,
      };
      const entity = this._dataUAMapper.toEntityUpdate(updateStatus);

      // Set and validate ID
      await entity.initializeUpdateSetId(
        new UserApprovalId(step.user_approvals.id),
      );
      await entity.validateExistingIdForUpdate();

      // Final existence check for ID before update
      await findOneOrFail(query.manager, UserApprovalOrmEntity, {
        id: entity.getId().value,
      });

      await this._writeUA.update(entity, query.manager);
    }

    return entity;
  }
}
