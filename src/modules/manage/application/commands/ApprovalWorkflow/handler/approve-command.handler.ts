import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { ApproveCommand } from '../approve.command';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { WRITE_APPROVAL_WORKFLOW_REPOSITORY } from '../../../constants/inject-key.const';
import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { ApprovalWorkflowDataMapper } from '../../../mappers/approval-workflow.mapper';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { EligiblePersons } from '../../../constants/status-key.const';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@CommandHandler(ApproveCommand)
export class ApproveCommandHandler
  implements
    IQueryHandler<ApproveCommand, ResponseResult<ApprovalWorkflowEntity>>
{
  constructor(
    @Inject(WRITE_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _write: IWriteApprovalWorkflowRepository,
    private readonly _dataMapper: ApprovalWorkflowDataMapper,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: ApproveCommand,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    let company_id: number | null | undefined = null;
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user.id;
    const company_user = await findOneOrFail(
      query.manager,
      CompanyUserOrmEntity,
      {
        user_id: user_id,
      },
      `company user id ${user_id}`,
    );

    company_id = company_user.company_id ?? undefined;

    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    if (
      !roles.includes(EligiblePersons.SUPER_ADMIN) ||
      !roles.includes(EligiblePersons.COMPANY_ADMIN)
    ) {
      throw new ManageDomainException(
        'errors.unauthorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (company_id) {
      await findOneOrFail(
        query.manager,
        ApprovalWorkflowOrmEntity,
        {
          id: query.id,
          company_id: company_id,
        },
        `Approval Workflow ID: ${query.id}`,
      );
    }

    await findOneOrFail(
      query.manager,
      ApprovalWorkflowOrmEntity,
      {
        id: query.id,
      },
      `Approval Workflow ID: ${query.id}`,
    );

    const entity = this._dataMapper.toEntityApprove(query.dto);
    await entity.initializeUpdateSetId(new ApprovalWorkflowId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, ApprovalWorkflowOrmEntity, {
      id: entity.getId().value,
    });

    return await this._write.approved(entity, query.manager);
  }
}
