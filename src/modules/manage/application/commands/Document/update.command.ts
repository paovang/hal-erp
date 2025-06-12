import { EntityManager } from 'typeorm';
import { UpdateDocumentDto } from '../../dto/create/document/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDocumentDto,
    public readonly manager: EntityManager,
  ) {}
}
