import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllForExportQuery } from '../get-all-for-export.query';
import { READ_PURCHASE_ORDER_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadPurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { PoListExportRow } from '@src/common/utils/excel-export.service';

@QueryHandler(GetAllForExportQuery)
export class GetAllForExportQueryHandler
  implements IQueryHandler<GetAllForExportQuery, PoListExportRow[]>
{
  constructor(
    @Inject(READ_PURCHASE_ORDER_REPOSITORY)
    private readonly _readRepo: IReadPurchaseOrderRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetAllForExportQuery): Promise<PoListExportRow[]> {
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user?.id;

    const companyUser = await query.manager.findOne(CompanyUserOrmEntity, {
      where: { user_id },
    });

    const company_id = companyUser?.company_id ?? undefined;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    const entities = await this._readRepo.findAllForExport(
      query.dto,
      query.manager,
      user_id,
      roles,
      company_id,
    );

    return entities.map((entity) => ({
      po_number: entity.po_number ?? '',
      createdAt: entity.createdAt ?? null,
      requesterUsername: entity.document?.requester?.username ?? '',
      total: Number(entity.total ?? 0),
    }));
  }
}
