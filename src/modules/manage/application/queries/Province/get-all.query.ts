import { EntityManager } from 'typeorm';
import { ProvinceQueryDto } from '../../dto/query/province.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: ProvinceQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
