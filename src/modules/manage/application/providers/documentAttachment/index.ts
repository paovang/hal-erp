import { Provider } from '@nestjs/common';
import { DocumentAttachmentMapperProviders } from './mapper.provider';
import { DocumentAttachmentHandlersProviders } from './command.provider';
import { WRITE_DOCUMENT_ATTACHMENT_REPOSITORY } from '../../constants/inject-key.const';
import { WriteDocumentAttachmentRepository } from '@src/modules/manage/infrastructure/repositories/documentAttachment/write.respository';

export const DocumentAttachmentProvider: Provider[] = [
  ...DocumentAttachmentHandlersProviders,
  ...DocumentAttachmentMapperProviders,
  {
    provide: WRITE_DOCUMENT_ATTACHMENT_REPOSITORY,
    useClass: WriteDocumentAttachmentRepository,
  },
];
