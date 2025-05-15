import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import { WRITE_DEPARTMENT_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { DepartmentEntity } from '@src/modules/manage/domain/entities/department.entity';
import { IWriteDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { ResponseResult } from '@src/common/application/interfaces/pagination.interface';
import { DepartmentDataMapper } from '@src/modules/manage/application/mappers/department.mapper';
import { UpdateCommand } from '@src/modules/manage/application/commands/department/update.command';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { Department } from '@src/common/infrastructure/database/typeorm/department.orm';

@CommandHandler(UpdateCommand)
export class UpdateCommandHandler
  implements IQueryHandler<UpdateCommand, ResponseResult<DepartmentEntity>>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_REPOSITORY)
    private readonly _write: IWriteDepartmentRepository,
    private readonly _dataMapper: DepartmentDataMapper,
  ) {}

  async execute(query: UpdateCommand): Promise<any> {
    const entity = this._dataMapper.toEntity(query.dto);
    await entity.initializeUpdateSetId(new DepartmentId(query.id));
    await entity.validateExistingIdForUpdate();

    /** Check Exits Department Id */
    await findOneOrFail(query.manager, Department, {
      id: entity.getId().value,
    });

    return await this._write.update(entity, query.manager);
  }
}
