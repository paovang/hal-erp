import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { Inject, NotFoundException } from '@nestjs/common';
import { READ_DEPARTMENT_APPROVER_REPOSITORY } from '../../../constants/inject-key.const';
import { DepartmentApproverEntity } from '@src/modules/manage/domain/entities/department-approver.entity';
import { IReadDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements
    IQueryHandler<GetAllQuery, ResponseResult<DepartmentApproverEntity>>
{
  constructor(
    @Inject(READ_DEPARTMENT_APPROVER_REPOSITORY)
    private readonly _readRepo: IReadDepartmentApproverRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new NotFoundException('No categories found.');
    }

    return data;
  }
}
