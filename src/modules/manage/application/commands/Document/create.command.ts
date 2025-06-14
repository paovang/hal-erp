import { EntityManager } from 'typeorm';
import { CreateDocumentDto } from '../../dto/create/Document/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateDocumentDto,
    public readonly manager: EntityManager,
  ) {}
}
