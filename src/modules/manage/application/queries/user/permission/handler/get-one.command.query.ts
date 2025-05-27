import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { READ_PERMISSION_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { PermissionGroupId } from '@src/modules/manage/domain/value-objects/permission-group-id.vo';
import { IReadPermissionRoleRepository } from '@src/modules/manage/domain/ports/output/permission-repository.interface';
import { PermissionGroupOrmEntity } from '@src/common/infrastructure/database/typeorm/permission-group.orm';
import { PermissionGroupEntity } from '@src/modules/manage/domain/entities/permission-group.entity';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<PermissionGroupEntity>>
{
  constructor(
    @Inject(READ_PERMISSION_REPOSITORY)
    private readonly _readRepo: IReadPermissionRoleRepository,
  ) {}

  async execute(
    query: GetOneQuery,
  ): Promise<ResponseResult<PermissionGroupEntity>> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'error.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await findOneOrFail(query.manager, PermissionGroupOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(
      new PermissionGroupId(query.id),
      query.manager,
    );
  }
}
