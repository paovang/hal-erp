import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { WRITE_DEPARTMENT_APPROVER_REPOSITORY } from '../../../constants/inject-key.const';
import { BadRequestException, Inject } from '@nestjs/common';
import { IWriteDepartmentApproverRepository } from '@src/modules/manage/domain/ports/output/department-approver-repositiory.interface';
import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentApproverId } from '@src/modules/manage/domain/value-objects/department-approver-id.vo';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_APPROVER_REPOSITORY)
    private readonly _write: IWriteDepartmentApproverRepository,
    // private readonly _dataMapper: DepartmentApproverDataMapper,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new BadRequestException('ID must be a number');
    }
    /** Check Exits CategoryId Id */
    await findOneOrFail(query.manager, DepartmentApproverOrmEntity, {
      id: query.id,
    });

    return await this._write.delete(
      new DepartmentApproverId(query.id),
      query.manager,
    );
  }
}
