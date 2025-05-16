import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import { WRITE_DEPARTMENT_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { Inject } from '@nestjs/common';
import { IWriteDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { DeleteCommand } from '../delete.command';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_REPOSITORY)
    private readonly _write: IWriteDepartmentRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    /** Check Exits Department Id */
    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(new DepartmentId(query.id), query.manager);
  }
}
