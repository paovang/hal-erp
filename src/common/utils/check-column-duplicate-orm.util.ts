import { BadRequestException } from '@nestjs/common';
import { Not } from 'typeorm'; // ✅ import this
import { UserOrmEntity } from '@src/common/infrastructure/database/typeorm/user.orm';

export async function _checkColumnDuplicate(
  field: keyof UserOrmEntity,
  value: any,
  manager: any,
  errorMessage = '',
  excludeId?: number, // optional
): Promise<void> {
  const where: any = { [field]: value };

  if (excludeId) {
    where.id = Not(excludeId);
  }

  const existing = await manager.findOne(UserOrmEntity, {
    where,
  });

  if (existing) {
    throw new BadRequestException(errorMessage);
  }
}
