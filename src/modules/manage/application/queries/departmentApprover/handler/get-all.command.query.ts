import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_DEPARTMENT_APPROVER_REPOSITORY } from '../../../constants/inject-key.const';
import { DepartmentApproverEntity } from '@src/modules/manage/domain/entities/department-approver.entity';
import { IReadDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements
    IQueryHandler<GetAllQuery, ResponseResult<DepartmentApproverEntity>>
{
  constructor(
    @Inject(READ_DEPARTMENT_APPROVER_REPOSITORY)
    private readonly _readRepo: IReadDepartmentApproverRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<DepartmentApproverEntity>> {
    // const departmentUser =
    //   this._userContextService.getAuthUser()?.departmentUser;
    // if (!departmentUser) {
    //   throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    // }

    // // const departmentId = (departmentUser as any).department_id;
    // const departmentId = (departmentUser as any).departments.id;
    const user = this._userContextService.getAuthUser()?.user;

    const user_id = user?.id;

    const departmentUser = await query.manager.findOne(
      DepartmentUserOrmEntity,
      {
        where: { user_id: user_id },
      },
    );

    const departmentId = departmentUser?.department_id ?? null;

    const data = await this._readRepo.findAll(
      query.dto,
      query.manager,
      departmentId!,
    );

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
