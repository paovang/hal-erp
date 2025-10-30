import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { CompanyUserEntity } from '@src/modules/manage/domain/entities/company-user.entity';
import { READ_COMPANY_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { GetOneQuery } from '../get-one.query';
import { IReadCompanyUserRepository } from '@src/modules/manage/domain/ports/output/company-user-repository.interface';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';
import { CompanyUserId } from '@src/modules/manage/domain/value-objects/company-user-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { CompanyUserOrmEntity } from '@src/common/infrastructure/database/typeorm/company-user.orm';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<CompanyUserEntity>>
{
  constructor(
    @Inject(READ_COMPANY_USER_REPOSITORY)
    private readonly _readRepo: IReadCompanyUserRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<CompanyUserEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }

    await findOneOrFail(
      query.manager,
      CompanyUserOrmEntity,
      {
        id: query.id,
      },
      `${query.id}}`,
    );

    const id = new CompanyUserId(query.id);
    return await this._readRepo.findOne(id, query.manager);
  }
}
