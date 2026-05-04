import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllForExportQuery } from '../get-all-for-export.query';
import { READ_PURCHASE_REQUEST_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadPurchaseRequestRepository } from '@src/modules/manage/domain/ports/output/purchase-request-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { PrListExportRow } from '@src/common/utils/excel-export.service';

@QueryHandler(GetAllForExportQuery)
export class GetAllForExportQueryHandler
  implements IQueryHandler<GetAllForExportQuery, PrListExportRow[]>
{
  constructor(
    @Inject(READ_PURCHASE_REQUEST_REPOSITORY)
    private readonly _readRepo: IReadPurchaseRequestRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetAllForExportQuery): Promise<PrListExportRow[]> {
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user?.id;

    const departmentUser = await query.manager.findOne(DepartmentUserOrmEntity, {
      where: { user_id },
    });

    const companyUser = await query.manager.findOne(CompanyUserOrmEntity, {
      where: { user_id },
    });

    const company_id = companyUser?.company_id ?? undefined;
    const departmentId = departmentUser?.department_id ?? null;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    const entities = await this._readRepo.findAllForExport(
      query.dto,
      query.manager,
      departmentId ?? undefined,
      user_id,
      roles,
      company_id,
    );

    return entities.map((entity) => ({
      pr_number: entity.pr_number ?? '',
      createdAt: entity.createdAt ?? null,
      requesterUsername: entity.document?.requester?.username ?? '',
    }));
  }
}
