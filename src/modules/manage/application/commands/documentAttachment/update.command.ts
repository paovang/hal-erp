import { EntityManager } from 'typeorm';
import { UpdateDocumentAttachmentDto } from '../../dto/create/documentSttachment/update.dto';

export class UpdateCommand {
  constructor(
    public readonly id: number,
    public readonly dto: UpdateDocumentAttachmentDto,
    public readonly manager: EntityManager,
  ) {}
}
