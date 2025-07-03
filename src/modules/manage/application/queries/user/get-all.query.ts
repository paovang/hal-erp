import { EntityManager } from 'typeorm';
import { UserQueryDto } from '../../dto/query/user-query.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: UserQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
