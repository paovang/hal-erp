import { Provider } from '@nestjs/common';
import { DocumentAttachmentMapperProviders } from './mapper.provider';
import { DocumentAttachmentHandlersProviders } from './command.provider';
import {
  DOCUMENT_ATTACHMENT_APPLICATION_SERVICE,
  WRITE_DOCUMENT_ATTACHMENT_REPOSITORY,
} from '../../constants/inject-key.const';
import { WriteDocumentAttachmentRepository } from '@src/modules/manage/infrastructure/repositories/documentAttachment/write.respository';
import { DocumentAttachmentService } from '../../services/document-attachment.service';

export const DocumentAttachmentProvider: Provider[] = [
  ...DocumentAttachmentHandlersProviders,
  ...DocumentAttachmentMapperProviders,
  {
    provide: DOCUMENT_ATTACHMENT_APPLICATION_SERVICE,
    useClass: DocumentAttachmentService,
  },
  {
    provide: WRITE_DOCUMENT_ATTACHMENT_REPOSITORY,
    useClass: WriteDocumentAttachmentRepository,
  },
];
