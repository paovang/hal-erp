import { sign, verify } from 'jsonwebtoken';
import { config } from 'dotenv';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { HttpStatus } from '@nestjs/common';

config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'default-secret-key';

export interface HashDataPayload {
  id: number;
  step_id: number;
  user_id: number;
  tel: string;
  email: string;
}

export async function hashData(
  id: number,
  step_id: number,
  user_id: number,
  tel: string,
  email: string,
): Promise<string> {
  let format_tel = tel ? String(tel).trim() : '';

  if (!tel.match(/^\d+$/)) {
    throw new ManageDomainException(
      'Invalid tel: must contain digits only',
      HttpStatus.BAD_REQUEST,
    );
  }

  // 2. Specific prefix check (020 -> 20)
  if (format_tel.startsWith('020')) {
    format_tel = format_tel.substring(1);
  }

  if (!format_tel.startsWith('20')) {
    format_tel = '20' + format_tel;
  }
  const payload: HashDataPayload = {
    id,
    step_id,
    user_id,
    tel: format_tel,
    email,
  };
  return sign(payload, SECRET_KEY, { expiresIn: '1y' });
}

// verify data
export function verifyHashData(token: string): HashDataPayload | null {
  try {
    return verify(token, SECRET_KEY) as HashDataPayload;
  } catch {
    throw new ManageDomainException(
      'errors.invalid_token',
      HttpStatus.BAD_REQUEST,
    );
  }
}
