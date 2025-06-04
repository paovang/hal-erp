import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_APPROVAL_WORKFLOW_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ApprovalWorkflowOrmEntity } from '@src/common/infrastructure/database/typeorm/approval-workflow.orm';
import { ApprovalWorkflowId } from '@src/modules/manage/domain/value-objects/approval-workflow-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<ApprovalWorkflowEntity>>
{
  constructor(
    @Inject(READ_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _readRepo: IReadApprovalWorkflowRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    await this.checkData(query);
    await findOneOrFail(query.manager, ApprovalWorkflowOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new ApprovalWorkflowId(query.id),
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
