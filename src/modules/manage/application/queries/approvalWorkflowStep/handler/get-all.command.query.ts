import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ApprovalWorkflowStepEntity } from '@src/modules/manage/domain/entities/approval-workflow-step.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_APPROVAL_WORKFLOW_STEP_REPOSITORY } from '../../../constants/inject-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadApprovalWorkflowStepRepository } from '@src/modules/manage/domain/ports/output/approval-workflow-step-repository.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements
    IQueryHandler<GetAllQuery, ResponseResult<ApprovalWorkflowStepEntity>>
{
  constructor(
    @Inject(READ_APPROVAL_WORKFLOW_STEP_REPOSITORY)
    private readonly _readRepo: IReadApprovalWorkflowStepRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<ApprovalWorkflowStepEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }
    const data = await this._readRepo.findAll(
      query.id,
      query.dto,
      query.manager,
    );

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
