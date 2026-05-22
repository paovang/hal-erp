import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpStatus, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { StatusEnum } from '@src/common/enums/status.enum';
import {
  APPROVAL_TOKEN_JWT_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { WRITE_APPROVAL_WORKFLOW_REPOSITORY } from '../../../constants/inject-key.const';
import { EligiblePersons } from '../../../constants/status-key.const';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';
import { ApproveByTokenCommand } from '../approve-by-token.command';
import { APPROVAL_TOKEN_PURPOSE } from './send-approval-mail-command.handler';

interface ApprovalMailTokenPayload {
  approval_workflow_id: number;
  approver_user_id: number;
  purpose: string;
}

@CommandHandler(ApproveByTokenCommand)
export class ApproveByTokenCommandHandler
  implements
    ICommandHandler<
      ApproveByTokenCommand,
      ResponseResult<ApprovalWorkflowEntity>
    >
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowRepository,
    private readonly _dataMapper: ApprovalWorkflowDataMapper,
    @Inject(APPROVAL_TOKEN_JWT_SERVICE)
    private readonly _approvalJwt: JwtService,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(
    command: ApproveByTokenCommand,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    const payload = await this.verifyToken(command.dto.token);

    if (payload.approval_workflow_id !== command.dto.approval_workflow_id) {
      throw new ManageDomainException(
        'errors.bad_request',
        HttpStatus.BAD_REQUEST,
        { property: 'approval_workflow_id' },
      );
    }

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const workflow = await findOneOrFail(
          manager,
          ApprovalWorkflowOrmEntity,
          { id: payload.approval_workflow_id },
          `Approval Workflow ID: ${payload.approval_workflow_id}`,
        );

        if (workflow.status !== StatusEnum.PENDING) {
          throw new ManageDomainException(
            'errors.already_approved',
            HttpStatus.CONFLICT,
            { property: `${workflow.id}` },
          );
        }

        const approver = await manager.findOne(UserOrmEntity, {
          where: { id: payload.approver_user_id },
          relations: ['roles'],
        });
        if (!approver) {
          throw new ManageDomainException(
            'errors.unauthorized',
            HttpStatus.FORBIDDEN,
            { property: 'approver_user_id' },
          );
        }

        const roleNames =
          approver.roles?.map((r) => r.name).filter((n): n is string => !!n) ??
          [];
        const isSuperAdmin = roleNames.includes(EligiblePersons.SUPER_ADMIN);
        const isAdmin = roleNames.includes(EligiblePersons.ADMIN);
        const isCompanyAdmin = roleNames.includes(
          EligiblePersons.COMPANY_ADMIN,
        );
        const isCrossCompanyApprover = isSuperAdmin || isAdmin;

        if (!isCrossCompanyApprover && !isCompanyAdmin) {
          throw new ManageDomainException(
            'errors.unauthorized',
            HttpStatus.FORBIDDEN,
            { property: 'approver_user_id' },
          );
        }

        if (!isCrossCompanyApprover && workflow.company_id) {
          const inCompany = await manager.findOne(CompanyUserOrmEntity, {
            where: {
              user_id: payload.approver_user_id,
              company_id: workflow.company_id,
            },
          });
          if (!inCompany) {
            throw new ManageDomainException(
              'errors.unauthorized',
              HttpStatus.FORBIDDEN,
              { property: 'approver_user_id' },
            );
          }
        }

        const entity = this._dataMapper.toEntityApprove({
          status: StatusEnum.APPROVED,
        });
        await entity.initializeUpdateSetId(new ApprovalWorkflowId(workflow.id));
        await entity.validateExistingIdForUpdate();

        return await this._write.approved(entity, manager);
      },
    );
  }

  private async verifyToken(token: string): Promise<ApprovalMailTokenPayload> {
    try {
      const payload =
        await this._approvalJwt.verifyAsync<ApprovalMailTokenPayload>(token);
      if (payload.purpose !== APPROVAL_TOKEN_PURPOSE) {
        throw new ManageDomainException(
          'errors.unauthorized',
          HttpStatus.UNAUTHORIZED,
          { property: 'token' },
        );
      }
      return payload;
    } catch (err) {
      if (err instanceof ManageDomainException) throw err;
      throw new ManageDomainException(
        'errors.unauthorized',
        HttpStatus.UNAUTHORIZED,
        { property: 'token' },
      );
    }
  }
}
