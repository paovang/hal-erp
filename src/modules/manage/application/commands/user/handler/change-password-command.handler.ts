import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ChangePasswordCommand } from '../change-password.command';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { WRITE_USER_REPOSITORY } from '../../../constants/inject-key.const';
import { HttpStatus, Inject } from '@nestjs/common';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { findOneOrFail } from '@src/common/utils/fine-one-orm.utils';
import * as bcrypt from 'bcrypt';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler
  implements ICommandHandler<ChangePasswordCommand, { message: string }>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
  ) {}

  async execute(command: ChangePasswordCommand): Promise<{ message: string }> {
    if (!Number.isInteger(command.userId) || command.userId <= 0) {
      throw new ManageDomainException(
        'errors.unauthorized',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = (await findOneOrFail(command.manager, UserOrmEntity, {
      id: command.userId,
    })) as UserOrmEntity;

    if (!user.password) {
      throw new ManageDomainException(
        'errors.incorrect_password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isMatch = await bcrypt.compare(command.dto.old_password, user.password);
    if (!isMatch) {
      throw new ManageDomainException(
        'errors.incorrect_password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await bcrypt.hash(command.dto.new_password, 10);
    await this._write.updatePasswordAndStamp(
      command.userId,
      hashedPassword,
      command.manager,
    );

    return { message: 'Password has been changed successfully' };
  }
}
