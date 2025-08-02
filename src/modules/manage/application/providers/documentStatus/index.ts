import { Provider } from '@nestjs/common';
import { DocumentStatusHandlersProviders } from './command.provider';
import { DocumentStatusMapperProviders } from './mapper.provider';
import {
  DOCUMENT_STATUS_APPLICATION_SERVICE,
  READ_DOCUMENT_STATUS_REPOSITORY,
} from '../../constants/inject-key.const';
import { ReadDocumentStatusRepository } from '@src/modules/manage/infrastructure/repositories/documentStatus/read.repository';
import { DocumentStatusService } from '../../services/document-status.service';

export const DocumentStatusProvider: Provider[] = [
  ...DocumentStatusHandlersProviders,
  ...DocumentStatusMapperProviders,
  {
    provide: DOCUMENT_STATUS_APPLICATION_SERVICE,
    useClass: DocumentStatusService,
  },
  {
    provide: READ_DOCUMENT_STATUS_REPOSITORY,
    useClass: ReadDocumentStatusRepository,
  },
];
