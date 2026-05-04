import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetAllForExportQuery } from '../get-all-for-export.query';
import { READ_RECEIPT_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';
import { ReceiptListExportRow } from '@src/common/utils/excel-export.service';

@QueryHandler(GetAllForExportQuery)
export class GetAllForExportQueryHandler
  implements IQueryHandler<GetAllForExportQuery, ReceiptListExportRow[]>
{
  constructor(
    @Inject(READ_RECEIPT_REPOSITORY)
    private readonly _readRepo: IReadReceiptRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetAllForExportQuery): Promise<ReceiptListExportRow[]> {
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
      receipt_number: entity.receipt_number ?? '',
      createdAt: entity.createdAt ?? null,
      requesterUsername: entity.document?.requester?.username ?? '',
      total: Number(entity.total ?? 0),
    }));
  }
}
