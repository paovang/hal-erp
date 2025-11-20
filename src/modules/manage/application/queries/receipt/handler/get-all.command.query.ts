import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { ReceiptEntity } from '@src/modules/manage/domain/entities/receipt.entity';
import { READ_RECEIPT_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadReceiptRepository } from '@src/modules/manage/domain/ports/output/receipt-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<ReceiptEntity>>
{
  constructor(
    @Inject(READ_RECEIPT_REPOSITORY)
    private readonly _readRepo: IReadReceiptRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<ReceiptEntity>> {
    const user = this._userContextService.getAuthUser()?.user;
    const user_id = user?.id;

    const company_user = await query.manager.findOne(CompanyUserOrmEntity, {
      where: {
        user_id: user_id,
      },
    });

    const company_id = company_user?.company_id ?? undefined;
    const roles = user?.roles?.map((r: any) => r.name) ?? [];

    const data = await this._readRepo.findAll(
      query.dto,
      query.manager,
      user_id,
      roles,
      company_id,
    );

    if (!data) {
      throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
