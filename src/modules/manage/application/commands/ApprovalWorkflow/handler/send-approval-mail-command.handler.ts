import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpStatus, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StatusEnum } from '@src/common/enums/status.enum';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { SendApprovalEmailUseCase } from '@src/common/infrastructure/mail/application/send-approval-email.usecase';
import { APPROVAL_TOKEN_JWT_SERVICE } from '@src/common/constants/inject-key.const';
import { ApprovalWorkflowDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/approval-workflow.mapper';
import { SendApprovalMailCommand } from '../send-approval-mail.command';
import { EligiblePersons } from '../../../constants/status-key.const';

export const APPROVAL_TOKEN_PURPOSE = 'approval-workflow-approve';

interface ApprovalMailTokenPayload {
  approval_workflow_id: number;
  approver_user_id: number;
  purpose: typeof APPROVAL_TOKEN_PURPOSE;
}

@CommandHandler(SendApprovalMailCommand)
export class SendApprovalMailCommandHandler
  implements
    ICommandHandler<
      SendApprovalMailCommand,
      ResponseResult<ApprovalWorkflowEntity>
    >
{
  constructor(
    private readonly _dataAccessMapper: ApprovalWorkflowDataAccessMapper,
    private readonly _userContextService: UserContextService,
    @Inject(APPROVAL_TOKEN_JWT_SERVICE)
    private readonly _approvalJwt: JwtService,
    private readonly _sendApprovalEmail: SendApprovalEmailUseCase,
  ) {}

  async execute(
    command: SendApprovalMailCommand,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    const { id, dto, manager } = command;

    if (isNaN(id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${id}` },
      );
    }

    const caller = this._userContextService.getAuthUser()?.user;
    if (!caller?.id) {
      throw new ManageDomainException(
        'errors.unauthorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const workflow = await manager.findOne(ApprovalWorkflowOrmEntity, {
      where: { id },
      relations: [
        'approval_workflow_steps',
        'approval_workflow_steps.departments',
        'approval_workflow_steps.users',
      ],
      order: { approval_workflow_steps: { step_number: 'ASC' } },
    });
    if (!workflow) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        { property: `Approval Workflow ID: ${id}` },
      );
    }

    if (workflow.status !== StatusEnum.PENDING) {
      throw new ManageDomainException(
        'errors.already_approved',
        HttpStatus.CONFLICT,
        { property: `${id}` },
      );
    }

    const approver = await manager.findOne(UserOrmEntity, {
      where: { id: dto.approver_user_id },
      relations: ['roles'],
    });
    if (!approver) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.NOT_FOUND,
        { property: `User ID: ${dto.approver_user_id}` },
      );
    }

    if (!approver.email) {
      throw new ManageDomainException(
        'errors.not_found',
        HttpStatus.BAD_REQUEST,
        { property: 'approver_email' },
      );
    }

    const approverRoles =
      approver.roles?.map((r) => r.name).filter((n): n is string => !!n) ?? [];
    const isCrossCompanyApprover =
      approverRoles.includes(EligiblePersons.SUPER_ADMIN) ||
      approverRoles.includes(EligiblePersons.ADMIN);

    if (!isCrossCompanyApprover && workflow.company_id) {
      const approverInCompany = await manager.findOne(CompanyUserOrmEntity, {
        where: {
          user_id: dto.approver_user_id,
          company_id: workflow.company_id,
        },
      });
      if (!approverInCompany) {
        throw new ManageDomainException(
          'errors.unauthorized',
          HttpStatus.FORBIDDEN,
          { property: 'approver_user_id' },
        );
      }
    }

    const payload: ApprovalMailTokenPayload = {
      approval_workflow_id: id,
      approver_user_id: dto.approver_user_id,
      purpose: APPROVAL_TOKEN_PURPOSE,
    };
    const token = await this._approvalJwt.signAsync(payload);

    const approverName =
      [approver.first_name, approver.last_name]
        .filter((s): s is string => !!s)
        .join(' ') ||
      approver.username ||
      approver.email;

    const steps = (workflow.approval_workflow_steps ?? [])
      .slice()
      .sort((a, b) => (a.step_number ?? 0) - (b.step_number ?? 0))
      .map((s) => ({
        id: s.id,
        step_name: s.step_name ?? '',
        step_number: s.step_number ?? 0,
        type: s.type ?? '',
        department: s.departments
          ? {
              code: (s.departments as any).code ?? '',
              name: (s.departments as any).name ?? '',
            }
          : null,
        user: s.users
          ? {
              username: (s.users as any).username ?? '',
              email: (s.users as any).email ?? '',
              tel: (s.users as any).tel ?? '',
            }
          : null,
      }));

    await this._sendApprovalEmail.execute({
      to: approver.email,
      approverName,
      workflowDisplayName: workflow.name ?? `#${id}`,
      token,
      workflowId: id,
      steps,
      description: dto.description,
    });

    return this._dataAccessMapper.toEntity(workflow);
  }
}
