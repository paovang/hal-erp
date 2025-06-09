import { CommandHandler, IQueryHandler } from '@nestjs/cqrs';
import { DeleteCommand } from '../delete.command';
import { WRITE_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { UserId } from '@src/modules/manage/domain/value-objects/user-id.vo';
import { UserDataMapper } from '../../../mappers/user.mapper';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { checkRelationOrThrow } from '@src/common/utils/check-relation-or-throw.util';
import { BudgetApprovalRuleOrmEntity } from '@src/common/infrastructure/database/typeorm/budget-approval-rule.orm';
import { DepartmentApproverOrmEntity } from '@src/common/infrastructure/database/typeorm/department-approver.orm';
import { DepartmentUserOrmEntity } from '@src/common/infrastructure/database/typeorm/department-user.orm';
import { UserHasPermissionOrmEntity } from '@src/common/infrastructure/database/typeorm/model-has-permission.orm';

@CommandHandler(DeleteCommand)
export class DeleteCommandHandler
  implements IQueryHandler<DeleteCommand, void>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    private readonly _dataMapper: UserDataMapper,
  ) {}

  async execute(query: DeleteCommand): Promise<void> {
    await this.checkData(query);

    /** Check Exits Document Type Id */
    const entity = await findOneOrFail(query.manager, UserOrmEntity, {
      id: query.id,
    });

    const email = (entity as any).email?.value || entity.email; // fallback if not VO
    const tel = (entity as any).tel?.value || entity.tel;

    const timestamp = Date.now();
    const deletedEmail = `${email}_delete_${timestamp}`;
    const deletedTel = `${tel}_delete_${timestamp}`;

    // ✅ Map to entity using fixed function
    const updatedEntity = this._dataMapper.toEntityForUpdateColumns({
      email: deletedEmail,
      tel: deletedTel,
    });

    // ✅ Set ID manually if builder doesn't do it
    updatedEntity.setId(new UserId(entity.id));

    // ✅ Update email & tel before delete
    await this._write.updateColumns(updatedEntity, query.manager);

    return await this._write.delete(new UserId(query.id), query.manager);
  }

  private async checkData(query: DeleteCommand): Promise<void> {
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

    await checkRelationOrThrow(
      query.manager,
      BudgetApprovalRuleOrmEntity,
      { approver_id: query.id },
      'errors.already_in_use',
    );

    await checkRelationOrThrow(
      query.manager,
      DepartmentApproverOrmEntity,
      { user_id: query.id },
      'errors.already_in_use',
    );

    await checkRelationOrThrow(
      query.manager,
      DepartmentUserOrmEntity,
      { user_id: query.id },
      'errors.already_in_use',
    );

    await checkRelationOrThrow(
      query.manager,
      UserHasPermissionOrmEntity,
      { user_id: query.id },
      'errors.already_in_use',
    );
  }
}
