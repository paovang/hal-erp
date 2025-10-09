import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowStepEntity } from '@src/modules/manage/domain/entities/approval-workflow-step.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_APPROVAL_WORKFLOW_STEP_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';
import { ApprovalWorkflowStepOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow-step.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ApprovalWorkflowStepId } from '@src/modules/manage/domain/value-objects/approval-workflow-step-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements
    IQueryHandler<GetOneQuery, ResponseResult<ApprovalWorkflowStepEntity>>
{
  constructor(
    @Inject(READ_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _readRepo: IReadApprovalWorkflowStepRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    await this.checkData(query);
    await findOneOrFail(query.manager, ApprovalWorkflowStepOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new ApprovalWorkflowStepId(query.id),
      query.manager,
    );
  }

  private async checkData(query: GetOneQuery): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
