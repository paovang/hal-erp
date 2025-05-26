import { HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';
import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';

export async function findOneOrFail<T extends ObjectLiteral>(
  manager: EntityManager,
  entityClass: EntityTarget<T>,
  where: Partial<T>,
): Promise<T> {
  const entity = await manager.findOne(entityClass, { where });
  if (!entity) {
    throw new ManageDomainException('errors.not_found', HttpStatus.NOT_FOUND);
  }

  return entity;
}
