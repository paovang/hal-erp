import { HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { Not } from 'typeorm';

export async function _checkColumnExchangeRateDuplicate<T>(
  entity: new () => T,
  field: keyof T | 'from_to',
  value: any,
  manager: any,
  errorMessage = '',
  excludeId?: number,
): Promise<void> {
  let where: any = {};

  if (field === 'from_to') {
    // ✅ กรณีพิเศษ: ตรวจ composite key
    where = {
      from_currency_id: value.from,
      to_currency_id: value.to,
    };
  } else {
    // ✅ ปกติ: ตรวจ field เดียว
    where = { [field]: value };
  }

  if (excludeId) {
    where.id = Not(excludeId);
  }

  const existing = await manager.findOne(entity, { where });

  if (existing) {
    throw new ManageDomainException(errorMessage, HttpStatus.BAD_REQUEST);
  }
}
