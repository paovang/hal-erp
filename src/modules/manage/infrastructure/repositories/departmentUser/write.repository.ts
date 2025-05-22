import { Injectable } from "@nestjs/common";
import { ResponseResult } from "@src/common/application/interfaces/pagination.interface";
import { DepartmentUserEntity } from "@src/modules/manage/domain/entities/department-user.entity";
import { IWriteDepartmentUserRepository } from "@src/modules/manage/domain/ports/output/department-user-repository.interface";
import { EntityManager } from "typeorm";
import { DepartmentUserDataAccessMapper } from "../../mappers/department-user.mapper";

@Injectable()
export class WriteDepartmentUserRepository implements IWriteDepartmentUserRepository {
  constructor(private readonly _dataAccessMapper: DepartmentUserDataAccessMapper) {}

  async create(
    entity: DepartmentUserEntity,
    manager: EntityManager,
  ): Promise<ResponseResult<DepartmentUserEntity>> {
    return this._dataAccessMapper.toEntity(
      await manager.save(this._dataAccessMapper.toOrmEntity(entity)),
    );
  }
}