import { EntityManager } from 'typeorm';
import { CountItemDto } from '../../dto/query/count-item.dto';

export class CountItemQuery {
  constructor(
    public readonly query: CountItemDto,
    public readonly manager: EntityManager,
  ) {}
}
