import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { PurchaseOrderEntity } from '@src/modules/manage/domain/entities/purchase-order.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_PURCHASE_ORDER_REPOSITORY } from '../../../constants/inject-key.const';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { IReadPurchaseOrderRepository } from '@src/modules/manage/domain/ports/output/purchase-order-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<PurchaseOrderEntity>>
{
  constructor(
    @Inject(READ_PURCHASE_ORDER_REPOSITORY)
    private readonly _readRepo: IReadPurchaseOrderRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<PurchaseOrderEntity>> {
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
