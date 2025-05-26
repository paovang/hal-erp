import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllQuery } from '../get-all.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { PermissionEntity } from '@src/modules/manage/domain/entities/permission.entity';
import { READ_PERMISSION_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject, NotFoundException } from '@nestjs/common';
import { IReadPermissionRoleRepository } from '@src/modules/manage/domain/ports/output/permission-repository.interface';
import { PermissionGroupEntity } from '@src/modules/manage/domain/entities/permission-group.entity';

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<PermissionGroupEntity>>
{
  constructor(
    @Inject(READ_PERMISSION_REPOSITORY)
    private readonly _readRepo: IReadPermissionRoleRepository,
  ) {}

  async execute(
    query: GetAllQuery,
  ): Promise<ResponseResult<PermissionGroupEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if (!data) {
      throw new NotFoundException('No users found.');
    }

    return data;
  }
}
