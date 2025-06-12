import { EntityManager } from 'typeorm';
import { CreateDocumentDto } from '../../dto/create/document/create.dto';

export class CreateCommand {
  constructor(
    public readonly dto: CreateDocumentDto,
    public readonly manager: EntityManager,
  ) {}
}
