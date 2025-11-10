import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PositionEntity } from '@src/modules/manage/domain/entities/position.entity';
import { HttpStatus, Inject } from '@nestjs/common';
import { READ_POSITION_REPOSITORY } from '../../../constants/inject-key.const';
import { IReadPositionRepository } from '@src/modules/manage/domain/ports/output/position-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<PositionEntity>>
{
  constructor(
    @Inject(READ_POSITION_REPOSITORY)
    private readonly _readRepo: IReadPositionRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<PositionEntity>> {
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
      company_id,
      roles,
    );

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
