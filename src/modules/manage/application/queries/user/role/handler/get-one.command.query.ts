import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOneQuery } from '../get-one.query';
import { ResponseResult } from '@common/infrastructure/pagination/pagination.interface';
import { RoleEntity } from '@src/modules/manage/domain/entities/role.entity';
import { READ_ROLE_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { IReadRoleRepository } from '@src/modules/manage/domain/ports/output/role-repository.interface';
import { BadRequestException, Inject } from '@nestjs/common';
import { RoleOrmEntity } from '@src/common/infrastructure/database/typeorm/role.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { RoleId } from '@src/modules/manage/domain/value-objects/role-id.vo';

@QueryHandler(GetOneQuery)
export class GetOneQueryHandler
  implements IQueryHandler<GetOneQuery, ResponseResult<RoleEntity>>
{
  constructor(
    @Inject(READ_ROLE_REPOSITORY)
    private readonly _readRepo: IReadRoleRepository,
  ) {}

  async execute(query: GetOneQuery): Promise<ResponseResult<RoleEntity>> {
    if (isNaN(query.id)) {
      throw new BadRequestException('id must be a number');
    }

    await findOneOrFail(query.manager, RoleOrmEntity, {
      id: query.id,
    });

    return await this._readRepo.findOne(new RoleId(query.id), query.manager);
  }
}
