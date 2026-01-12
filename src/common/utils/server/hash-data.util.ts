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
  email: string;
}

export async function hashData(
  id: number,
  step_id: number,
  user_id: number,
  email: string,
): Promise<string> {
  const payload: HashDataPayload = {
    id,
    step_id,
    user_id,
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
