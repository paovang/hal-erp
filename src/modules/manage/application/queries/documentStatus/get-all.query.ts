import { EntityManager } from 'typeorm';
import { DocumentStatusQueryDto } from '../../dto/query/document-status.dto';

export class GetAllQuery {
  constructor(
    public readonly query: DocumentStatusQueryDto,
    public readonly manager: EntityManager,
  ) {}
}
