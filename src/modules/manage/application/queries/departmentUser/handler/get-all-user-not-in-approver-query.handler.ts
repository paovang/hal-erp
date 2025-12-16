import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { DepartmentUserEntity } from '@src/modules/manage/domain/entities/department-user.entity';
import { READ_DEPARTMENT_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { IReadDepartmentUserRepository } from '@src/modules/manage/domain/ports/output/department-user-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { getAllNotHaveInApproversQuery } from '../get-all-user-not-in-approver.query';

@QueryHandler(getAllNotHaveInApproversQuery)
export class getAllNotHaveInApproversQueryHandler
  implements
    IQueryHandler<
      getAllNotHaveInApproversQuery,
      ResponseResult<DepartmentUserEntity>
    >
{
  constructor(
    @Inject(READ_DEPARTMENT_USER_REPOSITORY)
    private readonly _readRepo: IReadDepartmentUserRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: getAllNotHaveInApproversQuery,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    const data = await this._readRepo.getAllNotHaveInApproversQuery(
      query.dto,
      query.manager,
    );

    return data;
  }
}
