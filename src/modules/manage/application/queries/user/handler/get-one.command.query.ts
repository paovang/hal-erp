import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { IReadUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { READ_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<UserEntity>>
{
  constructor(
    @Inject(READ_USER_REPOSITORY)
    private readonly _readRepo: IReadUserRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<UserEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(new UserId(query.id), query.manager);
  }
}
