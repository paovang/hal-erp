import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface SendResetPasswordEmailInput {
  to: string;
  displayName: string;
  token: string;
  expiresInMinutes: number;
}

@Injectable()
export class SendResetPasswordEmailUseCase {
  private readonly _logger = new Logger(SendResetPasswordEmailUseCase.name);

  async execute(input: SendResetPasswordEmailInput): Promise<void> {
    const apiUrl = process.env.APPROVAL_API_URL;
    const secret = process.env.APPROVAL_SECRET_KEY;
    if (!apiUrl || !secret) {
      this._logger.error(
        'APPROVAL_API_URL or APPROVAL_SECRET_KEY is not configured — reset email skipped',
      );
      return;
    }

    try {
      await axios.post(`${apiUrl}/send-reset-password-mail`, input, {
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': secret,
        },
      });
    } catch (error: any) {
      this._logger.error(
        `Reset password mail enqueue failed for ${input.to}: ${
          error?.response?.data?.message ?? error?.message ?? 'unknown error'
        }`,
      );
    }
  }
}
