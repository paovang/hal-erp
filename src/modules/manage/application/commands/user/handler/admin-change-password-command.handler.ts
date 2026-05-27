import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpStatus, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminChangePasswordCommand } from '../admin-change-password.command';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { WRITE_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

/**
 * Admin sets another user's password by id — does NOT require the target
 * user's current password. Stamps password_changed_at so any outstanding
 * reset-password tokens for that user are invalidated.
 */
@CommandHandler(AdminChangePasswordCommand)
export class AdminChangePasswordCommandHandler
  implements ICommandHandler<AdminChangePasswordCommand, { message: string }>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
  ) {}

  async execute(
    command: AdminChangePasswordCommand,
  ): Promise<{ message: string }> {
    if (isNaN(command.id)) {
      throw new ManageDomainException(
        'errors.must_be_number',
        HttpStatus.BAD_REQUEST,
        { property: `${command.id}` },
      );
    }

    await findOneOrFail(command.manager, UserOrmEntity, { id: command.id });

    const hashedPassword = await bcrypt.hash(command.dto.new_password, 10);
    await this._write.updatePasswordAndStamp(
      command.id,
      hashedPassword,
      command.manager,
    );

    return { message: 'Password has been changed successfully' };
  }
}
