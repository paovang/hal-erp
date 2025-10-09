import { Provider } from '@nestjs/common';
import { DocumentAttachmentDataAccessMapper } from '@src/modules/manage/infrastructure/mappers/document-attachment.mapper';
import { DocumentAttachmentDataMapper } from '../../mappers/document-attachment.mapper';

export const DocumentAttachmentMapperProviders: Provider[] = [
  DocumentAttachmentDataAccessMapper,
  DocumentAttachmentDataMapper,
];
