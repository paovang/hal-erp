import { HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { Not } from 'typeorm';

export async function _checkColumnDuplicate<T>(
  entity: new () => T,
  field: keyof T,
  value: any,
  manager: any,
  errorMessage = '',
  excludeId?: number,
  companyId?: number,
): Promise<void> {
  const where: any = { [field]: value };

  if (excludeId) {
    where.id = Not(excludeId);
  }

  if (companyId) {
    where.company_id = companyId;
  }

  const existing = await manager.findOne(entity, { where });

  if (existing) {
    throw new ManageDomainException(errorMessage, HttpStatus.BAD_REQUEST);
  }
}
