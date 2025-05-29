import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { UserEntity } from '@src/modules/manage/domain/entities/user.entity';
import { READ_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IReadUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<UserEntity>>
{
  constructor(
    @Inject(READ_USER_REPOSITORY)
    private readonly _readRepo: IReadUserRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<UserEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new ManageDomainException('error.not_found', HttpStatus.NOT_FOUND);
    }

    return data;
  }
}
