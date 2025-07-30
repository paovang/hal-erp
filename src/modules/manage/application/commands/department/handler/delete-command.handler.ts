import { IQueryHandler, CommandHandler } from '@nestjs/cqrs';
import { WRITE_DEPARTMENT_REPOSITORY } from '@src/modules/manage/application/constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteDepartmentRepository } from '@src/modules/manage/domain/ports/output/department-repository.interface';
import { DepartmentId } from '@src/modules/manage/domain/value-objects/department-id.vo';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { DepartmentOrmEntity } from '@src/common/infrastructure/database/typeorm/department.orm';
import { DeleteCommand } from '../delete.command';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import { BudgetAccountOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-account.orm';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_DEPARTMENT_REPOSITORY)
    private readonly _write: IWriteDepartmentRepository,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    await this.checkData(query);
    return await this._write.delete(new DepartmentId(query.id), query.manager);
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${query.id}` },
      );
    }
    /** Check Exits Department Id */
    await findOneOrFail(query.manager, DepartmentOrmEntity, {
      id: query.id,
    });

    await checkRelationOrThrow(
      query.manager,
      DepartmentUserOrmEntity,
      { department_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'department user',
    );

    await checkRelationOrThrow(
      query.manager,
      DepartmentApproverOrmEntity,
      { department_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'department approver',
    );

    await checkRelationOrThrow(
      query.manager,
      BudgetAccountOrmEntity,
      { department_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'budget account',
    );

    await checkRelationOrThrow(
      query.manager,
      BudgetApprovalRuleOrmEntity,
      { department_id: query.id },
      'errors.already_in_use',
      HttpStatus.BAD_REQUEST,
      'budget approval rule',
    );
  }
}
