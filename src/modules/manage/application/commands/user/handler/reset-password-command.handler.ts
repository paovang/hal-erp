import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpStatus, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ResetPasswordCommand } from '../reset-password.command';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import { IWriteUserRepository } from '@src/modules/manage/domain/ports/output/user-repository.interface';
import { WRITE_USER_REPOSITORY } from '../../../constants/inject-key.const';
import {
  RESET_PASSWORD_TOKEN_JWT_SERVICE,
  TRANSACTION_MANAGER_SERVICE,
} from '@src/common/constants/inject-key.const';
import { ITransactionManagerService } from '@src/common/infrastructure/transaction/transaction.interface';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

export const RESET_PASSWORD_TOKEN_PURPOSE = 'reset-password';

interface ResetPasswordTokenPayload {
  user_id: number;
  email: string;
  purpose: string;
  iat: number;
  exp: number;
}

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordCommandHandler
  implements ICommandHandler<ResetPasswordCommand, { message: string }>
{
  constructor(
    @Inject(WRITE_USER_REPOSITORY)
    private readonly _write: IWriteUserRepository,
    @Inject(RESET_PASSWORD_TOKEN_JWT_SERVICE)
    private readonly _jwt: JwtService,
    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
    @InjectDataSource(process.env.WRITE_CONNECTION_NAME)
    private readonly _dataSource: DataSource,
  ) {}

  async execute(command: ResetPasswordCommand): Promise<{ message: string }> {
    const payload = await this._verify(command.dto.token);

    return await this._transactionManagerService.runInTransaction(
      this._dataSource,
      async (manager) => {
        const user = await manager.findOne(UserOrmEntity, {
          where: { id: payload.user_id },
          select: ['id', 'email', 'password_changed_at'],
        });

        if (!user) {
          throw new ManageDomainException(
            'errors.invalid_or_expired_token',
            HttpStatus.UNAUTHORIZED,
          );
        }

        if ((user.email ?? '') !== payload.email) {
          throw new ManageDomainException(
            'errors.invalid_or_expired_token',
            HttpStatus.UNAUTHORIZED,
          );
        }

        if (user.password_changed_at) {
          const changedAtSec = Math.floor(
            user.password_changed_at.getTime() / 1000,
          );
          if (payload.iat < changedAtSec) {
            throw new ManageDomainException(
              'errors.invalid_or_expired_token',
              HttpStatus.UNAUTHORIZED,
            );
          }
        }

        const hashedPassword = await bcrypt.hash(command.dto.new_password, 10);
        await this._write.updatePasswordAndStamp(
          user.id,
          hashedPassword,
          manager,
        );

        return { message: 'Password has been reset successfully' };
      },
    );
  }

  private async _verify(token: string): Promise<ResetPasswordTokenPayload> {
    let payload: ResetPasswordTokenPayload;
    try {
      payload = await this._jwt.verifyAsync<ResetPasswordTokenPayload>(token);
    } catch {
      throw new ManageDomainException(
        'errors.invalid_or_expired_token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (payload.purpose !== RESET_PASSWORD_TOKEN_PURPOSE) {
      throw new ManageDomainException(
        'errors.invalid_or_expired_token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return payload;
  }
}
