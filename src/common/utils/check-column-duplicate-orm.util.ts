import { BadRequestException } from '@nestjs/common';
import { Not } from 'typeorm';

export async function _checkColumnDuplicate<T>(
  entity: new () => T,
  field: keyof T,
  value: any,
  manager: any,
  errorMessage = '',
  excludeId?: number,
): Promise<void> {
  const where: any = { [field]: value };

  if (excludeId) {
    where.id = Not(excludeId);
  }

  const existing = await manager.findOne(entity, { where });

  if (existing) {
    throw new BadRequestException(errorMessage);
  }
}
