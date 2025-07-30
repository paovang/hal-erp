import { EntityManager, ObjectType } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { ManageDomainException } from '@src/modules/manage/domain/exceptions/manage-domain.exception';

export async function checkRelationOrThrow(
  manager: EntityManager,
  entity: ObjectType<any>,
  where: Record<string, any>,
  errorMessageKey: string, // e.g. 'errors.budget_item_exist'
  statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  property?: string,
): Promise<void> {
  const count = await manager.count(entity, { where });

  if (count > 0) {
    const entityName = typeof entity === 'function' ? entity.name : 'Entity';
    throw new ManageDomainException(errorMessageKey, statusCode, {
      property: property ?? entityName,
    });
  }
}
