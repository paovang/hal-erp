import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { READ_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { UserContextService } from '@src/common/infrastructure/cls/cls.service';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<UserEntity>>
{
  constructor(
    @Inject(READ_USER_REPOSITORY)
    private readonly _readRepo: IReadUserRepository,
    private readonly _userContextService: UserContextService,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<UserEntity>> {
    const user = this._userContextService.getAuthUser()?.user;

    const user_id = user?.id;
    const data = await this._readRepo.findAll(
      query.dto,
      query.manager,
      user_id,
    );

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
