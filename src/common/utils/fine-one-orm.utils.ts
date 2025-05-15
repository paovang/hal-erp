import { EntityManager, EntityTarget, ObjectLiteral } from 'typeorm';

export async function findOneOrFail<T extends ObjectLiteral>(
  manager: EntityManager,
  entityClass: EntityTarget<T>,
  where: Partial<T>,
  errorMessage = 'Entity not found',
): Promise<T> {
  const entity = await manager.findOne(entityClass, { where });
  if (!entity) {
    throw new Error(errorMessage);
  }
  return entity;
}
