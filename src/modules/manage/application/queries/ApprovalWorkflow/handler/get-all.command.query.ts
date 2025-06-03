import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowEntity } from '@src/modules/manage/domain/entities/approval-workflow.entity';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_APPROVAL_WORKFLOW_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadApprovalWorkflowRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<ApprovalWorkflowEntity>>
{
  constructor(
    @Inject(READ_APPROVAL_WORKFLOW_REPOSITORY)
    private readonly _readRepo: IReadApprovalWorkflowRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<ApprovalWorkflowEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
