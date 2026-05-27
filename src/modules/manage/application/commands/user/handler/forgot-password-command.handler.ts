import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ForgotPasswordCommand } from '../forgot-password.command';
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';
import {
  RESET_PASSWORD_TOKEN_JWT_SERVICE,
  SEND_RESET_PASSWORD_EMAIL_USE_CASE,
} from '@src/common/constants/inject-key.const';
import { SendResetPasswordEmailUseCase } from '@src/common/infrastructure/mail/application/send-reset-password-email.usecase';

const GENERIC_MESSAGE =
  'If the email is registered, a reset link has been sent';

function parseExpiresToMinutes(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const match = value.trim().match(/^(\d+)([smhd])?$/i);
  if (!match) return fallback;
  const n = Number(match[1]);
  switch ((match[2] ?? 's').toLowerCase()) {
    case 'd':
      return n * 24 * 60;
    case 'h':
      return n * 60;
    case 'm':
      return n;
    default:
      return Math.max(1, Math.round(n / 60));
  }
}

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordCommandHandler
  implements ICommandHandler<ForgotPasswordCommand, { message: string }>
{
  private readonly _logger = new Logger(ForgotPasswordCommandHandler.name);

  constructor(
    @Inject(RESET_PASSWORD_TOKEN_JWT_SERVICE)
    private readonly _jwt: JwtService,
    @Inject(SEND_RESET_PASSWORD_EMAIL_USE_CASE)
    private readonly _sendMail: SendResetPasswordEmailUseCase,
    private readonly _config: ConfigService,
  ) {}

  async execute(
    command: ForgotPasswordCommand,
  ): Promise<{ message: string }> {
    const email = command.dto.email;

    const user = await command.manager.findOne(UserOrmEntity, {
      where: { email },
      select: ['id', 'email', 'username', 'first_name', 'last_name'],
    });

    if (!user) {
      this._logger.log(`forgot-password: no user for email (silent ok)`);
      return { message: GENERIC_MESSAGE };
    }

    const token = await this._jwt.signAsync({
      user_id: user.id,
      email: user.email,
      purpose: 'reset-password',
    });

    const expiresInMinutes = parseExpiresToMinutes(
      this._config.get<string>('RESET_PASSWORD_TOKEN_EXPIRES_IN'),
      15,
    );

    const displayName =
      [user.first_name, user.last_name].filter(Boolean).join(' ').trim() ||
      user.username ||
      user.email ||
      '';

    try {
      await this._sendMail.execute({
        to: user.email!,
        displayName,
        token,
        expiresInMinutes,
      });
    } catch (err: any) {
      this._logger.error(
        `forgot-password: send mail failed for user ${user.id}: ${
          err?.message ?? 'unknown'
        }`,
      );
    }

    return { message: GENERIC_MESSAGE };
  }
}
