import { PartialType } from '@nestjs/swagger';
import { CreateDocumentDto } from './create.dto';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {}
