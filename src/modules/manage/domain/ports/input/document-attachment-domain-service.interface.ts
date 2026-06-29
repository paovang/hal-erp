import { ResponseResult } from '@src/common/infrastructure/pagination/pagination.interface';
import { EntityManager } from 'typeorm';
import { DocumentAttachmentEntity } from '../../entities/document-attachment.entity';
import { UpdateDocumentAttachmentDto } from '@src/modules/manage/application/dto/create/documentSttachment/update.dto';

export interface IDocumentAttachmentServiceInterface {
  update(
    id: number,
    dto: UpdateDocumentAttachmentDto,
    manager?: EntityManager,
  ): Promise<ResponseResult<DocumentAttachmentEntity>>;
}
