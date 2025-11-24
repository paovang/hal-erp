import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { RoleEntity } from '@src/modules/manage/domain/entities/role.entity';
import { READ_ROLE_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject, NotFoundException } from '@nestjs/common';
import { IReadRoleRepository } from '@src/modules/manage/domain/ports/output/role-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { GetAllForCompanyQuery } from '../get-all-for-company.query';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
// import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@QueryHandler(GetAllForCompanyQuery)
export class GetAllForCompanyQueryHandler
  implements IQueryHandler<GetAllForCompanyQuery, ResponseResult<RoleEntity>>
{
  constructor(
    @Inject(READ_ROLE_REPOSITORY)
    private readonly _readRepo: IReadRoleRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetAllForCompanyQuery,
  ): Promise<ResponseResult<RoleEntity>> {
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user?.id;

    const departmentUser = await query.manager.findOne(
      DepartmentUserOrmEntity,
      {
        where: { user_id: user_id },
      },
    );

    const company_user = await query.manager.findOne(CompanyUserOrmEntity, {
      where: {
        user_id: user_id,
      },
    });

    const company_id = company_user?.company_id ?? undefined;
    console.log('company_id', company_id);
    const roles = user?.roles?.map((r: any) => r.name) ?? [];
    const department_id = departmentUser?.department_id ?? null;
    const data = await this._readRepo.findAllForCompany(
      query.dto,
      query.manager,
      roles,
      company_id,
      department_id || undefined,
    );

    if (!data) {
      throw new NotFoundException('No users found.');
    }

    return data;
  }
}
