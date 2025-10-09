import { EntityManager } from 'typeorm';
import { DocumentQueryDto } from '../../dto/query/document.dto';

export class GetAllQuery {
  constructor(
    public readonly dto: DocumentQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
