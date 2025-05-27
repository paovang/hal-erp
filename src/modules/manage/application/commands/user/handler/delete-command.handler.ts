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
    if (isNaN(query.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
      );
    }

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
}
