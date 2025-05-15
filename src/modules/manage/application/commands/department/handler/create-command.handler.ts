import { CreateCommand } from '@src/modules/manage/application/commands/department/create.command';
import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import { WRITE_DEPARTMENT_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { IWriteDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DepartmentDataMapper } from '@src/modules/manage/application/mappers/department.mapper';

@CommandHandler(CreateCommand)
export class CreateCommandHandler
  implements IQueryHandler<CreateCommand, ResponseResult<DepartmentEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_REPOSITORY)
    private readonly _write: IWriteDepartmentRepository,
    private readonly _dataMapper: DepartmentDataMapper,
  ) {}

  async execute(
    query: CreateCommand,
  ): Promise<ResponseResult<DepartmentEntity>> {
    const mapToEntity = this._dataMapper.toEntity(query.dto);

    return await this._write.create(mapToEntity, query.manager);
  }
}
