import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { DepartmentApproverEntity } from '@src/modules/manage/domain/entities/department-approver.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_DEPARTMENT_APPROVER_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import { DepartmentApproverId } from '@src/modules/manage/domain/value-objects/department-approver-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements
    IQueryHandler<GetOneQuery, ResponseResult<DepartmentApproverEntity>>
{
  constructor(
    @Inject(READ_DEPARTMENT_APPROVER_REPOSITORY)
    private readonly _readRepo: IReadDepartmentApproverRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'error.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, DepartmentApproverOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new DepartmentApproverId(query.id),
      query.manager,
    );
  }
}
