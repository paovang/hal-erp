import { EntityManager } from 'typeorm';

export class GetAllByDepartmentQuery {
  constructor(
    public readonly department_id: number,
    public readonly manager: EntityManager,
  ) {}
}
