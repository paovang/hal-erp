import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAllQuery } from "../get-all.query";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { RoleEntity } from "@src/modules/manage/domain/entities/role.entity";
import { READ_ROLE_REPOSITORY } from "@src/modules/manage/application/constants/inject-key.const";
import { Inject, NotFoundException } from "@nestjs/common";
import { IReadRoleRepository } from "@src/modules/manage/domain/ports/output/role-repository.interface";

@QueryHandler(GetAllQuery)
export class GetAllQueryHandler
  implements IQueryHandler<GetAllQuery, ResponseResult<RoleEntity>>
{
  constructor(
    @Inject(READ_ROLE_REPOSITORY)
    private readonly _readRepo: IReadRoleRepository,
  ) {}

  async execute(query: GetAllQuery): Promise<ResponseResult<RoleEntity>> {
    const data = await this._readRepo.findAll(query.dto, query.manager);

    if(!data) {
      throw new NotFoundException('No users found.');
    }

    return data;
  }
}